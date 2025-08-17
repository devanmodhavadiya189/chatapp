import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, Paperclip, Phone, Video, MoreVertical, File, X, Smile } from 'lucide-react';
import image1 from '../assets/image1.jpg';
import Welcome3DFace from './Welcome3DFace';

import MessageBubble from './MessageBubble';
import EmojiPicker from 'emoji-picker-react';
import { api } from '../lib/api.js';
import ContactInfoModal from './ContactInfoModal';
import MediaModal from './MediaModal';

// Helper to compress images (keep this as is)
async function compressImage(file, maxSizeMB = 10) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.sqrt((maxSizeMB * 1024 * 1024) / file.size);
      const width = img.width * Math.min(1, scale);
      const height = img.height * Math.min(1, scale);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob.size > maxSizeMB * 1024 * 1024) {
            reject(new Error('Image is too large even after compression.'));
          } else {
            resolve(new File([blob], file.name, { type: blob.type }));
          }
        },
        file.type,
        0.7 // quality
      );
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ChatArea() {
  // Refs
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileUploadBoxRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const iconClickedRef = useRef(false);

  // State
  const [messageText, setMessageText] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  // Context
  const { user } = useAuth();
  const { activeChat, messages, sendMessage, getUserById } = useChat();

  // Constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const activeUser = getUserById(activeChat);

  // Effect for handling Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        // Close modals first if they're open
        if (showContactInfo) {
          setShowContactInfo(false);
          return;
        }
        if (showMedia) {
          setShowMedia(false);
          return;
        }
        if (showMenu) {
          setShowMenu(false);
          return;
        }
        if (showEmojiPicker) {
          setShowEmojiPicker(false);
          return;
        }
        if (showFileUpload) {
          setShowFileUpload(false);
          return;
        }
        
        // Then handle input blur or file clearing
        if (document.activeElement === inputRef.current) {
          inputRef.current.blur();
        } else if (selectedFiles.length > 0) {
          setSelectedFiles([]);
        }
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [selectedFiles, showContactInfo, showMedia, showMenu, showEmojiPicker, showFileUpload]);

  // Effect for scrolling to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect for handling clicks outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect for handling clicks outside file upload box
  useEffect(() => {
    if (!showFileUpload) return;
    
    const handlePointerDown = (e) => {
      // Check if the click was on the attach button
      const isAttachButton = e.target.closest('[data-testid="button-attach-file"]');
      
      // If it was the attach button, just update the ref and return
      if (isAttachButton) {
        iconClickedRef.current = true;
        return;
      }
      
      // If click was outside the file upload box, close it
      if (fileUploadBoxRef.current && !fileUploadBoxRef.current.contains(e.target)) {
        setShowFileUpload(false);
      }
    };
    
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showFileUpload]);

  // Helper functions
  const getInitials = (fullname) => {
    return fullname
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      if (messageText.trim()) {
        await sendMessage(messageText.trim());
      }
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const uploadResponse = await api.uploadFile(file);
            await sendMessage('', uploadResponse.file);
          } catch (error) {
            console.error('Failed to upload file:', error);
          }
        }
      }
      
      setMessageText('');
      setSelectedFiles([]);
      setShowFileUpload(false);
      
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    setFileError("");
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (files.length === 0) return;
    
    const processedFiles = [];
    for (const file of files) {
      if (file.size <= MAX_FILE_SIZE) {
        processedFiles.push(file);
        continue;
      }
      
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await compressImage(file);
          if (compressed.size <= MAX_FILE_SIZE) {
            processedFiles.push(compressed);
          } else {
            setFileError(`Image "${file.name}" is too large even after compression (max 10MB).`);
          }
        } catch {
          setFileError(`Failed to compress image "${file.name}" or it is too large.`);
        }
      } else {
        setFileError(`File "${file.name}" is too large (max 10MB).`);
      }
    }
    
    if (processedFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...processedFiles]);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Focus the input after file selection
    inputRef.current?.focus();
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    await handleFileSelect(e);
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Welcome3DFace />
          <h3 className="text-xl font-semibold text-sky-deep mb-2">Welcome to SamVad</h3>
          <p className="text-neutral-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

// 3D tilt logo component
function Logo3DTilt() {
  const logoRef = React.useRef(null);

  const handleMouseMove = (e) => {
    const logo = logoRef.current;
    if (!logo) return;
    const rect = logo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 18; // max 18deg
    const rotateX = -((y - centerY) / centerY) * 10; // max 10deg
    logo.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.12) skewY(-2deg) skewX(2deg)`;
    logo.style.boxShadow = '0 12px 32px 0 rgba(0,0,0,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)';
  };
  const handleMouseLeave = () => {
    const logo = logoRef.current;
    if (!logo) return;
    logo.style.transform = '';
    logo.style.boxShadow = '';
  };
  return (
    <div
      className="flex items-center justify-center mx-auto mb-4 relative"
      style={{height: '100px'}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Chat bubble SVG background */}
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="45" rx="40" ry="32" fill="#e0e7ef" />
        <ellipse cx="50" cy="45" rx="32" ry="26" fill="#f1f5fa" />
        <ellipse cx="50" cy="45" rx="24" ry="18" fill="#fff" />
        <path d="M50 77c-7 0-13-2-18-5 0 0 2 7-7 10 7-7 4-13 4-13C17 62 10 54 10 45c0-19 18-34 40-34s40 15 40 34c0 9-7 17-19 24 0 0-3 6 4 13-9-3-7-10-7-10-5 3-11 5-18 5z" fill="#e0e7ef"/>
      </svg>
      {/* Logo with 3D tilt effect */}
      <img
        ref={logoRef}
        src={image1}
        alt="SamVad Logo"
        className="w-24 h-24 rounded-2xl shadow-xl z-10"
        style={{objectFit: 'cover', background: '#fff', transition: 'transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s cubic-bezier(.25,.8,.25,1)'}}
      />
    </div>
  );
}

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Modals */}
      <ContactInfoModal 
        show={showContactInfo} 
        onClose={() => setShowContactInfo(false)} 
        user={activeUser} 
      />
      
      <MediaModal 
        show={showMedia} 
        onClose={() => setShowMedia(false)} 
        messages={messages} 
      />

      {/* File error message */}
      {fileError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">
          {fileError}
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-white border-b border-sky-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-sky-200">
                {activeUser?.profilephoto ? (
                  <img 
                    src={activeUser.profilephoto} 
                    alt={activeUser.fullname}
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-xs">{getInitials(activeUser?.fullname || 'User')}</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sky-deep" data-testid="text-active-user-name">
                {activeUser?.fullname}
              </h3>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
              data-testid="button-voice-call"
            >
              <Phone className="text-sky-primary" size={18} />
            </button>
            <button 
              className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
              data-testid="button-video-call"
            >
              <Video className="text-sky-primary" size={18} />
            </button>
            <div className="relative">
              <button
                className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                data-testid="button-more-options"
                onClick={() => setShowMenu((v) => !v)}
              >
                <MoreVertical className="text-sky-primary" size={18} />
              </button>
              {showMenu && (
                <div className="card-sky absolute right-0 mt-2 w-48 p-2 z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-sky-50 rounded text-sky-deep"
                    onClick={() => { setShowContactInfo(true); setShowMenu(false); }}
                  >
                    View Contact Info
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-sky-50 rounded text-sky-deep"
                    onClick={() => { setShowMedia(true); setShowMenu(false); }}
                  >
                    View Media
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 px-2 min-h-0 bg-gradient-to-b from-sky-25 to-white" style={{ maxHeight: '100%' }}>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              message={message}
              isOwnMessage={message.senderid === user?._id}
              senderName={message.senderid === user?._id ? user.fullname : activeUser?.fullname}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-sky-200 p-4 flex-shrink-0 relative">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              iconClickedRef.current = true;
              setShowFileUpload((prev) => !prev);
            }}
            className="p-2 text-neutral-500 hover:text-sky-primary transition-colors"
            data-testid="button-attach-file"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-neutral-500 hover:text-sky-primary transition-colors"
              data-testid="button-emoji"
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiObject) => {
                    setMessageText(prev => prev + emojiObject.emoji);
                    setShowEmojiPicker(false);
                  }}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              ref={inputRef}
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="input-sky rounded-full"
              data-testid="input-message"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={(!messageText.trim() && selectedFiles.length === 0) || isUploading}
            className="btn-sky-primary p-3 rounded-full"
            data-testid="button-send-message"
          >
            {isUploading ? (
              <div className="loading-sky w-4 h-4"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>

        {/* File Upload Area */}
        {showFileUpload && (
          <div
            ref={fileUploadBoxRef}
            className={`mt-3 p-4 border-2 border-dashed rounded-xl shadow-lg transition-colors ${
              isDragOver
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 bg-white'
            }`}
            style={{ position: 'absolute', bottom: '70px', left: 0, right: 0, zIndex: 20, maxWidth: '500px', margin: '0 auto' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
              data-testid="input-file"
            />
            
            {selectedFiles.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                  </p>
                  {isUploading && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                      <span className="text-sm text-gray-500">Uploading...</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                      <File size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-primary-400 mb-2">
                  <Paperclip size={32} className="mx-auto" />
                </div>
                <p className="text-gray-700 text-base font-medium">
                  {isDragOver ? (
                    <span className="text-primary-500 font-semibold">Drop files here to send</span>
                  ) : (
                    <>
                      Drag and drop files here or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary-500 hover:text-primary-600 font-semibold underline"
                        data-testid="button-browse-files"
                      >
                        browse
                      </button>
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: Images, PDFs, Documents, Text files
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}