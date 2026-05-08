import { Paperclip, Smile, Send } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useTheme } from '../../context/ThemeContext';

export default function MessageInput({
  messageText,
  setMessageText,
  selectedFiles,
  isUploading,
  showEmojiPicker,
  setShowEmojiPicker,
  setShowFileUpload,
  handleSendMessage,
  inputRef,
  emojiPickerRef,
  iconClickedRef
}) {
  const { theme } = useTheme();

  return (
    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          iconClickedRef.current = true;
          setShowFileUpload((prev) => !prev);
        }}
        className="p-2 transition-colors rounded-xl"
        data-testid="button-attach-file"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
      >
        <Paperclip size={20} />
      </button>
      
      <div className="relative" ref={emojiPickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 transition-colors rounded-xl"
          data-testid="button-emoji"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
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
              theme={theme === 'dark' ? 'dark' : 'light'}
            />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <textarea
          ref={inputRef}
          placeholder="Type a message..."
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if ((messageText.trim() || selectedFiles.length > 0) && !isUploading) {
                handleSendMessage(e);
              }
            }
          }}
          rows={1}
          className="input-sky rounded-full resize-none w-full min-h-[40px] max-h-40 overflow-auto"
          data-testid="input-message"
          autoFocus
          style={{whiteSpace: 'pre-wrap'}}
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
  );
}
