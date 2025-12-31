import { Paperclip, Smile, Send } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

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
  return (
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
