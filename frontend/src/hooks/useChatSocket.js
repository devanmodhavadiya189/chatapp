import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../lib/api';
import { getPrivateKey } from '../utils/crypto/keyManagement';
import { deriveSharedKey, decrypt } from '../utils/crypto/encryption';
import { setSharedKey, getSharedKey, invalidateSharedKey } from '../utils/crypto/sharedKeyCache';

export function useChatSocket({ user, isAuthenticated, state, dispatch }) {
  const socketRef = useRef(null);
  const activeChatRef = useRef(null);
  const decryptionFailuresRef = useRef({});

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

        const isOwnMessage = message.senderid === user._id;


        if (!isOwnMessage) {
          dispatch({ type: 'ADD_MESSAGE', payload: processedMessage });
        }
      });

      socketRef.current.on('messages_seen', (data) => {
        if (
          (data.receiverId === user._id && data.senderId === activeChatRef.current) ||
          (data.senderId === user._id && data.receiverId === activeChatRef.current)
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
        if (state.activeChat && user?._id) {
          socketRef.current.emit('leave_chat', user._id);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user?._id]);

  return socketRef.current;
}
