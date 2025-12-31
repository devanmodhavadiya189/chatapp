import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api.js';
import ContactInfoModal from './ContactInfoModal';
import MediaModal from './MediaModal';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import FileUploadBox from './chat/FileUploadBox';
import WelcomeScreen from './chat/WelcomeScreen';
import { useFileHandling } from '../utils/hooks/useFileHandling';

export default function ChatArea({ onOpenSidebar, onShowProfile, onShowAbout }) {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileUploadBoxRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const iconClickedRef = useRef(false);

  const [messageText, setMessageText] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const { user } = useAuth();
  const { activeChat, messages, sendMessage, getUserById } = useChat();
  const activeUser = getUserById(activeChat);

  const {
    selectedFiles,
    setSelectedFiles,
    isDragOver,
    fileError,
    handleFileSelect,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileHandling();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showFileUpload) return;
    
    const handlePointerDown = (e) => {
      const isAttachButton = e.target.closest('[data-testid="button-attach-file"]');
      
      if (isAttachButton) {
        iconClickedRef.current = true;
        return;
      }
      
      if (fileUploadBoxRef.current && !fileUploadBoxRef.current.contains(e.target)) {
        setShowFileUpload(false);
      }
    };
    
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showFileUpload]);

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
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelectWrapper = async (e) => {
    await handleFileSelect(e, fileInputRef);
    inputRef.current?.focus();
  };

  const handleDropWrapper = async (e) => {
    await handleDrop(e);
    await handleFileSelect(e, fileInputRef);
  };

  if (!activeChat) {
    return <WelcomeScreen onShowProfile={onShowProfile} onShowAbout={onShowAbout} />;
  }

  return (
    <div className="h-full w-full flex flex-col min-h-0">
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

      {fileError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">
          {fileError}
        </div>
      )}

      <ChatHeader 
        activeUser={activeUser}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setShowContactInfo={setShowContactInfo}
        setShowMedia={setShowMedia}
        onOpenSidebar={onOpenSidebar}
      />

      <div className="flex-1 min-h-0 overflow-y-auto py-4 px-2 bg-gradient-to-b from-sky-25 to-white">
        <MessageList 
          messages={messages}
          user={user}
          activeUser={activeUser}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="bg-white border-t border-sky-200 p-4 flex-shrink-0 relative">
        <MessageInput
          messageText={messageText}
          setMessageText={setMessageText}
          selectedFiles={selectedFiles}
          isUploading={isUploading}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          setShowFileUpload={setShowFileUpload}
          handleSendMessage={handleSendMessage}
          inputRef={inputRef}
          emojiPickerRef={emojiPickerRef}
          iconClickedRef={iconClickedRef}
        />

        <FileUploadBox
          showFileUpload={showFileUpload}
          isDragOver={isDragOver}
          selectedFiles={selectedFiles}
          isUploading={isUploading}
          fileInputRef={fileInputRef}
          fileUploadBoxRef={fileUploadBoxRef}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDropWrapper}
          handleFileSelect={handleFileSelectWrapper}
          removeFile={removeFile}
        />
      </div>
    </div>
  );
}