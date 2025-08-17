import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload]
      };
    case 'UPDATE_MESSAGES_SEEN':
      return {
        ...state,
        messages: state.messages.map(message => 
          message.senderid === action.payload.senderId && 
          message.reciverid === action.payload.receiverId
            ? { ...message, seen: true, seenAt: action.payload.seenAt }
            : message
        )
      };
    case 'UPDATE_UNSEEN_COUNTS':
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.senderId
            ? { ...user, unseenCount: (user.unseenCount || 0) + 1 }
            : user
        )
      };
    case 'CLEAR_UNSEEN_COUNT':
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.userId
            ? { ...user, unseenCount: 0 }
            : user
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  users: [],
  activeChat: null,
  messages: [],
  loading: false,
  error: null,
};

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Socket.IO setup
  const socketRef = useRef(null);
  const activeChatRef = useRef(null);
  
  // Keep activeChatRef in sync with state
  useEffect(() => {
    activeChatRef.current = state.activeChat;
  }, [state.activeChat]);

  useEffect(() => {
    if (isAuthenticated && !socketRef.current) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8004';
      socketRef.current = io(socketUrl, {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
        timeout: 20000,
        forceNew: false,
        autoConnect: true
      });

      socketRef.current.on('connect', () => {
        // Join user to enable presence tracking
        if (user?._id) {
          socketRef.current.emit('join_user', user._id);
          // Re-join active chat if any
          if (state.activeChat) {
            socketRef.current.emit('join_chat', {
              userId: user._id,
              chatUserId: state.activeChat
            });
          }
        }
      });
      
      socketRef.current.on('reconnect', () => {
        // Rejoin user and active chat on reconnection
        if (user?._id) {
          socketRef.current.emit('join_user', user._id);
          if (state.activeChat) {
            socketRef.current.emit('join_chat', {
              userId: user._id,
              chatUserId: state.activeChat
            });
          }
        }
      });

      socketRef.current.on('receive_message', (message) => {
        // Use ref to get current active chat to avoid stale closure
        const currentActiveChat = activeChatRef.current;
        const belongsToActiveChat = (
          (message.senderid === user._id && message.reciverid === currentActiveChat) ||
          (message.senderid === currentActiveChat && message.reciverid === user._id)
        );
        
        if (belongsToActiveChat) {
          dispatch({ type: 'ADD_MESSAGE', payload: message });
        } else if (message.reciverid === user._id) {
          dispatch({ 
            type: 'UPDATE_UNSEEN_COUNTS', 
            payload: { senderId: message.senderid } 
          });
        }
      });

      socketRef.current.on('messages_seen', (data) => {
        // Update seen status for messages in current chat
        if (
          (data.receiverId === user._id && data.senderId === state.activeChat) ||
          (data.senderId === user._id && data.receiverId === state.activeChat)
        ) {
          dispatch({ 
            type: 'UPDATE_MESSAGES_SEEN', 
            payload: {
              senderId: data.senderId,
              receiverId: data.receiverId,
              seenAt: data.seenAt
            }
          });
        }
      });
    }
    return () => {
      if (socketRef.current) {
        // Leave current chat before disconnecting
        if (state.activeChat && user?._id) {
          socketRef.current.emit('leave_chat', user._id);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [isAuthenticated, user?._id]); // Removed state.activeChat to prevent socket recreation

  const loadUsers = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const users = await api.getUsers();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const selectChat = async (userId) => {
    try {
      // Leave current chat if any
      if (state.activeChat && socketRef.current && user?._id) {
        socketRef.current.emit('leave_chat', user._id);
      }
      
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: userId });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear unseen count for this user
      dispatch({ type: 'CLEAR_UNSEEN_COUNT', payload: { userId } });
      
      // Join new chat
      if (socketRef.current && user?._id) {
        socketRef.current.emit('join_chat', {
          userId: user._id,
          chatUserId: userId
        });
      }
      
      const messages = await api.getMessages(userId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const sendMessage = async (text, file = null) => {
    if (!state.activeChat) return;

    try {
      await api.sendMessage(state.activeChat, text, file);
      
  // Do not add message optimistically; wait for Socket.IO event
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const getUserById = (userId) => {
    return state.users.find(u => u._id === userId);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    selectChat,
    sendMessage,
    getUserById,
    clearError,
    loadUsers,
    socket: socketRef.current,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};