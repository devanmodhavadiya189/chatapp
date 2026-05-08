import { getInitials } from '../utils/userHelpers';
import { formatTime } from '../utils/timeHelpers';
import { renderFileContent } from './message/fileContentRenderer.jsx';

export default function MessageBubble({ message, isOwnMessage, senderName }) {
  const renderContent = () => {
    if (message.decryption_status === 'key_unavailable') {
      return (
        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13px' }}>
          Encrypted message - key unavailable
        </div>
      );
    }

    if (message.decryption_status === 'failed') {
      return (
        <div style={{ color: '#dc2626', fontStyle: 'italic', fontSize: '13px' }}>
          Encrypted message - decryption failed
        </div>
      );
    }

    if (message.file) {
      return renderFileContent(message);
    }

    return (
      <span className="leading-relaxed break-words break-all whitespace-pre-line w-full">
        {message.text || message.content}
      </span>
    );
  };

  const isFailed = message.decryption_status === 'key_unavailable' || message.decryption_status === 'failed';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-6 px-2 animate-sky-fade`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[90%] ${isOwnMessage ? 'ml-4' : 'mr-4'}`}>
        
        <div className="flex-shrink-0 w-10 h-10 rounded-full shadow-md border-2 overflow-hidden avatar-themed mt-6">
          {message.sender?.profilephoto ? (
            <img 
              src={message.sender.profilephoto} 
              alt={message.sender?.fullname || senderName || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--avatar-gradient)' }}>
              {getInitials(message.sender?.fullname || senderName || 'Unknown')}
            </div>
          )}
        </div>

        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          
          <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <p className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
              {isOwnMessage ? 'You' : (message.sender?.fullname || senderName || 'Unknown')}
            </p>
            <p className="text-xs text-themed-muted" style={{ color: 'var(--text-muted)' }}>
              {formatTime(message.createdAt || message.timestamp)}
            </p>
          </div>

          <div className={`relative ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
            
            <div className={`relative ${
              message.file 
                ? 'bg-transparent p-0' 
                : isFailed
                  ? 'px-4 py-3 rounded-[20px]'
                  : isOwnMessage 
                    ? 'chat-bubble-sent px-4 py-3' 
                    : 'chat-bubble-received px-4 py-3'
            } max-w-full break-words`}
            style={isFailed ? { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-main)', borderRadius: '20px', backdropFilter: 'blur(12px)' } : {}}
            >
              {renderContent()}
            </div>
            
            {isOwnMessage && (
              <div className={`flex items-center mt-1 gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 flex items-center justify-center`} style={{ color: message.seen ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" className="fill-current">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </div>
                  
                  {message.seen && (
                    <div className="w-3 h-3 flex items-center justify-center -ml-1.5" style={{ color: 'var(--accent-primary)' }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" className="fill-current">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}