import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';
import { getPrivateKey } from '../utils/crypto/keyManagement';
import { deriveSharedKey, encrypt, decrypt } from '../utils/crypto/encryption';
import { setSharedKey, getSharedKey } from '../utils/crypto/sharedKeyCache';
import { chatReducer, initialState } from '../reducers/chatReducer';
import { useChatSocket } from '../hooks/useChatSocket';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  const selectChatRequestRef = useRef(null);

  const socket = useChatSocket({ user, isAuthenticated, state, dispatch });

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
    deriveSharedKeyForChat();
  }, [state.activeChat, deriveSharedKeyForChat]);

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
    const requestId = Date.now() + '_' + Math.random();
    selectChatRequestRef.current = requestId;

    try {
      if (state.activeChat && socket && user?._id) {
        socket.emit('leave_chat', user._id);
      }
      
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: userId });
      dispatch({ type: 'SET_MESSAGES', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_UNSEEN_COUNT', payload: { userId } });
      
      if (socket && user?._id) {
        socket.emit('join_chat', {
          userId: user._id,
          chatUserId: userId
        });
      }
      
      const messages = await api.getMessages(userId);

      if (selectChatRequestRef.current !== requestId) return;
      
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

      if (selectChatRequestRef.current !== requestId) return;
      dispatch({ type: 'SET_MESSAGES', payload: decryptedMessages });
    } catch (error) {
      if (selectChatRequestRef.current === requestId) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
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
      const optimisticMessage = {
        _id: `temp_${Date.now()}`,
        senderid: user._id,
        reciverid: pendingUserId,
        text: pendingMessage,
        file: pendingFile || null,
        iv: null,
        seen: false,
        createdAt: new Date(),
        decryption_status: 'success',
        sender: { _id: user._id, fullname: user.fullname, profilephoto: user.profilephoto }
      };

      dispatch({ type: 'ADD_MESSAGE', payload: optimisticMessage });
      await api.sendMessage(pendingUserId, pendingMessage, pendingFile, null);
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
    socket,
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