import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';
import { getPrivateKey } from '../utils/crypto/keyManagement';
import { deriveSharedKey, encrypt, decrypt } from '../utils/crypto/encryption';
import { setSharedKey, getSharedKey, invalidateSharedKey } from '../utils/crypto/sharedKeyCache';

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
    case 'REPLACE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, idx) => 
          idx === action.payload.index ? action.payload.message : msg
        )
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
    case 'SET_SHARED_KEY_STATUS':
      return { ...state, sharedKeyStatus: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_OFFLINE_MODAL':
      return { ...state, offlineModal: action.payload };
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
  sharedKeyStatus: { ready: false, message: 'No chat selected' },
  offlineModal: { show: false, userName: '', pendingMessage: '', pendingFile: null, pendingUserId: null },
};

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  const socketRef = useRef(null);
  const activeChatRef = useRef(null);
  const decryptionFailuresRef = useRef({});
  
  useEffect(() => {
    activeChatRef.current = state.activeChat;
  }, [state.activeChat]);

  const deriveSharedKeyForChat = useCallback(async () => {
    if (!state.activeChat || !user?._id) {
      dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: false, message: 'No chat selected' } });
      return;
    }

    try {
      const cachedKey = getSharedKey(user._id, state.activeChat);
      if (cachedKey) {
        dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: true, message: 'Secured' } });
        return;
      }

      dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: false, message: 'Establishing encrypted channel...' } });

      const privateKey = await getPrivateKey(user._id);
      if (!privateKey) {
        dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: false, message: 'Your encryption key not found' } });
        return;
      }

      const chatUser = state.users.find(u => u._id === state.activeChat);
      if (!chatUser || !chatUser.publicKey) {
        dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: false, message: 'User encryption key not available' } });
        return;
      }

      const sharedKey = await deriveSharedKey(privateKey, chatUser.publicKey);
      setSharedKey(user._id, state.activeChat, sharedKey);
      dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: true, message: 'Secured' } });
    } catch (error) {
      console.error("Key derivation error:", error);
      dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: false, message: 'encryption key establishment failed' } });
    }
  }, [state.activeChat, state.users, user?._id]);

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
        autoConnect: true,
        transports: ['websocket'],
        
      });

      socketRef.current.on('connect', () => {
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

      socketRef.current.on('receive_message', async (message) => {
        const currentActiveChat = activeChatRef.current;
        const belongsToActiveChat = (
          (message.senderid === user._id && message.reciverid === currentActiveChat) ||
          (message.senderid === currentActiveChat && message.reciverid === user._id)
        );

        const otherUserId = message.senderid === user._id ? message.reciverid : message.senderid;
        
        if (!belongsToActiveChat && message.reciverid === user._id) {
          dispatch({ 
            type: 'UPDATE_UNSEEN_COUNTS', 
            payload: { senderId: message.senderid } 
          });
          return;
        }

        if (!belongsToActiveChat) return;

        let processedMessage = { ...message };

        if (message.iv && typeof message.iv === 'string' && message.iv.trim()) {
          let sharedKey = getSharedKey(user._id, otherUserId);
          
          if (!sharedKey) {
            const chatUserFromState = state.users.find(u => u._id === otherUserId);
            if (chatUserFromState && chatUserFromState.publicKey) {
              try {
                const privateKey = await getPrivateKey(user._id);
                if (privateKey) {
                  sharedKey = await deriveSharedKey(privateKey, chatUserFromState.publicKey);
                  setSharedKey(user._id, otherUserId, sharedKey);
                }
              } catch (error) {
                console.error("Failed to derive key on message reception:", error);
              }
            }
          }

          if (sharedKey) {
            try {
              const decrypted = await decrypt(sharedKey, message.iv, message.text);
              processedMessage.text = decrypted;
              processedMessage.decryption_status = 'success';
              decryptionFailuresRef.current[otherUserId] = 0;
            } catch (error) {
              console.error("Decryption failed with current key:", error);
              processedMessage.decryption_status = 'failed';
              processedMessage.text = '';
              
              decryptionFailuresRef.current[otherUserId] = (decryptionFailuresRef.current[otherUserId] || 0) + 1;
              
              if (decryptionFailuresRef.current[otherUserId] >= 2) {
                try {
                  console.log("Attempting to fetch fresh user data and re-derive key...");
                  const updatedUsers = await api.getUsers();
                  dispatch({ type: 'SET_USERS', payload: updatedUsers });
                  
                  invalidateSharedKey(user._id, otherUserId);
                  
                  const updatedChatUser = updatedUsers.find(u => u._id === otherUserId);
                  if (updatedChatUser && updatedChatUser.publicKey) {
                    const privateKey = await getPrivateKey(user._id);
                    if (privateKey) {
                      const newSharedKey = await deriveSharedKey(privateKey, updatedChatUser.publicKey);
                      setSharedKey(user._id, otherUserId, newSharedKey);
                      
                      try {
                        const decrypted = await decrypt(newSharedKey, message.iv, message.text);
                        processedMessage.text = decrypted;
                        processedMessage.decryption_status = 'success';
                        decryptionFailuresRef.current[otherUserId] = 0;
                        dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: true, message: 'Key re-established' } });
                      } catch (retryError) {
                        console.error("Still failed after key refresh:", retryError);
                        processedMessage.decryption_status = 'failed';
                        processedMessage.text = '';
                      }
                    }
                  }
                } catch (err) {
                  console.error("Key re-derivation error:", err);
                }
              }
            }
          } else {
            processedMessage.decryption_status = 'key_unavailable';
            processedMessage.text = '';
          }
        }

        const messageAlreadyExists = state.messages.some(m => m._id === message._id);
        const isOwnMessage = message.senderid === user._id;
        
        if (!messageAlreadyExists && !isOwnMessage) {
          dispatch({ type: 'ADD_MESSAGE', payload: processedMessage });
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

  useEffect(() => {
    deriveSharedKeyForChat();
  }, [state.activeChat, deriveSharedKeyForChat]);

  useEffect(() => {
    const usersWithPendingMessages = state.users.filter(u => {
      const pending = getPendingMessages(u._id);
      return pending.length > 0 && u.publicKey;
    });

    usersWithPendingMessages.forEach(u => {
      sendPendingMessages(u._id);
    });
  }, [state.users]);

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
      
      let decryptedMessages = messages;
      try {
        const chatUser = state.users.find(u => u._id === userId);
        let sharedKey = getSharedKey(user._id, userId);
        
        if (!sharedKey && chatUser && chatUser.publicKey) {
          const privateKey = await getPrivateKey(user._id);
          if (privateKey) {
            sharedKey = await deriveSharedKey(privateKey, chatUser.publicKey);
            setSharedKey(user._id, userId, sharedKey);
          }
        }

        decryptedMessages = await Promise.all(
          messages.map(async (msg) => {
            if (msg.iv && typeof msg.iv === 'string' && msg.iv.trim() && msg.text && sharedKey) {
              try {
                const decrypted = await decrypt(sharedKey, msg.iv, msg.text);
                return { ...msg, text: decrypted, decryption_status: 'success' };
              } catch (error) {
                console.error('Decryption failed for message:', msg._id, error);
                return { ...msg, decryption_status: 'failed', text: '' };
              }
            }
            return msg;
          })
        );
      } catch (error) {
        console.error('Error decrypting historical messages:', error);
      }

      dispatch({ type: 'SET_MESSAGES', payload: decryptedMessages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getPendingMessages = (userId) => {
    const key = `pending_messages_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const addPendingMessage = (userId, message, file = null) => {
    const key = `pending_messages_${userId}`;
    const pending = getPendingMessages(userId);
    pending.push({
      text: message,
      file,
      timestamp: Date.now()
    });
    localStorage.setItem(key, JSON.stringify(pending));
  };

  const sendPendingMessages = async (userId) => {
    const pending = getPendingMessages(userId);
    if (pending.length === 0) return;

    const chatUser = state.users.find(u => u._id === userId);
    if (!chatUser || !chatUser.publicKey) return;

    try {
      const privateKey = await getPrivateKey(user._id);
      if (!privateKey) return;

      for (const msg of pending) {
        const sharedKey = await deriveSharedKey(privateKey, chatUser.publicKey);
        setSharedKey(user._id, userId, sharedKey);

        const { iv, ciphertext } = await encrypt(sharedKey, msg.text);
        await api.sendMessage(userId, ciphertext, msg.file, iv);
      }

      localStorage.removeItem(`pending_messages_${userId}`);
    } catch (error) {
      console.error('Error sending pending messages:', error);
    }
  };

  const sendMessage = async (text, file = null) => {
    if (!state.activeChat) return;

    try {
      const chatUser = state.users.find(u => u._id === state.activeChat);
      
      if (!chatUser) {
        throw new Error('Chat user not found');
      }

      let sharedKey = getSharedKey(user._id, state.activeChat);
      let iv = null;
      let messageText = text;
      
      if (!sharedKey) {
        if (!chatUser.publicKey) {
          dispatch({ 
            type: 'SET_OFFLINE_MODAL', 
            payload: { 
              show: true, 
              userName: chatUser.fullname || 'User',
              pendingMessage: text,
              pendingFile: file,
              pendingUserId: state.activeChat
            } 
          });
          return;
        }

        try {
          const privateKey = await getPrivateKey(user._id);
          if (!privateKey) {
            throw new Error('Your encryption key not found');
          }

          sharedKey = await deriveSharedKey(privateKey, chatUser.publicKey);
          setSharedKey(user._id, state.activeChat, sharedKey);
          dispatch({ type: 'SET_SHARED_KEY_STATUS', payload: { ready: true, message: 'Secured' } });
        } catch (error) {
          console.error('Key derivation failed:', error);
          sharedKey = null;
        }
      }

      if (sharedKey) {
        try {
          const encrypted_msg = await encrypt(sharedKey, text);
          iv = encrypted_msg.iv;
          messageText = encrypted_msg.ciphertext;
        } catch (error) {
          console.error('Encryption failed:', error);
          throw new Error('Message encryption failed: ' + error.message);
        }
      }

      const optimisticMessage = {
        _id: `temp_${Date.now()}`,
        senderid: user._id,
        reciverid: state.activeChat,
        text: text,
        file: file || null,
        iv: iv,
        seen: false,
        createdAt: new Date(),
        decryption_status: 'success'
      };

      dispatch({ type: 'ADD_MESSAGE', payload: optimisticMessage });

      await api.sendMessage(state.activeChat, messageText, file, iv);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const handleSendPlaintext = async () => {
    const { pendingMessage, pendingFile, pendingUserId } = state.offlineModal;
    
    dispatch({ type: 'SET_OFFLINE_MODAL', payload: { show: false, userName: '', pendingMessage: '', pendingFile: null, pendingUserId: null } });

    try {
      await api.sendMessage(pendingUserId, pendingMessage, pendingFile, null);
      dispatch({ type: 'SET_ERROR', payload: 'Message sent as plaintext (user offline).' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message: ' + error.message });
    }
  };

  const handleWaitForOnline = () => {
    dispatch({ type: 'SET_OFFLINE_MODAL', payload: { show: false, userName: '', pendingMessage: '', pendingFile: null, pendingUserId: null } });
    dispatch({ type: 'SET_ERROR', payload: 'Message not sent. Waiting for user to come online.' });
  };

  const handleQueueMessage = () => {
    const { pendingMessage, pendingFile, pendingUserId } = state.offlineModal;
    
    dispatch({ type: 'SET_OFFLINE_MODAL', payload: { show: false, userName: '', pendingMessage: '', pendingFile: null, pendingUserId: null } });
    addPendingMessage(pendingUserId, pendingMessage, pendingFile);
    dispatch({ type: 'SET_ERROR', payload: 'Message queued. Will send when user comes online.' });
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
    sharedKeyStatus: state.sharedKeyStatus,
    handleSendPlaintext,
    handleWaitForOnline,
    handleQueueMessage,
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