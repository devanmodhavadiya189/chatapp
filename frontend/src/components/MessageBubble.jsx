import { getInitials } from '../utils/userHelpers';
import { formatTime } from '../utils/timeHelpers';
import { renderFileContent } from './message/fileContentRenderer.jsx';

export default function MessageBubble({ message, isOwnMessage, senderName }) {
  const renderContent = () => {
    if (message.decryption_status === 'key_unavailable') {
      return (
        <div style={{ color: '#999', fontStyle: 'italic', fontSize: '13px' }}>
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

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-6 px-2 animate-sky-fade`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[90%] ${isOwnMessage ? 'ml-4' : 'mr-4'}`}>
        
        <div className={`flex-shrink-0 w-10 h-10 rounded-full shadow-md border-2 ${isOwnMessage ? 'border-sky-200' : 'border-sky-300'} overflow-hidden bg-gradient-to-br from-sky-400 to-sky-600 mt-6`}>
          {message.sender?.profilephoto ? (
            <img 
              src={message.sender.profilephoto} 
              alt={message.sender?.fullname || senderName || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-sky-500 to-sky-700">
              {getInitials(message.sender?.fullname || senderName || 'Unknown')}
            </div>
          )}
        </div>

        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          
          <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <p className="text-xs font-medium text-sky-700">
              {isOwnMessage ? 'You' : (message.sender?.fullname || senderName || 'Unknown')}
            </p>
            <p className="text-xs text-neutral-400">
              {formatTime(message.createdAt || message.timestamp)}
            </p>
          </div>

          <div className={`relative ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
            
            <div className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} ${isOwnMessage ? '-mr-2' : '-ml-2'} top-4 w-0 h-0 ${
              message.decryption_status === 'key_unavailable' || message.decryption_status === 'failed'
                ? isOwnMessage 
                  ? 'border-l-8 border-l-gray-100 border-t-8 border-t-transparent border-b-8 border-b-transparent'
                  : 'border-r-8 border-r-gray-100 border-t-8 border-t-transparent border-b-8 border-b-transparent'
                : isOwnMessage 
                  ? 'border-l-8 border-l-sky-500 border-t-8 border-t-transparent border-b-8 border-b-transparent'
                  : 'border-r-8 border-r-slate-100 border-t-8 border-t-transparent border-b-8 border-b-transparent'
            }`}></div>

            <div className={`relative ${
              message.file 
                ? 'bg-transparent p-0' 
                : message.decryption_status === 'key_unavailable' || message.decryption_status === 'failed'
                  ? 'bg-gray-100 text-gray-600 shadow-lg rounded-2xl px-4 py-3 border border-gray-200'
                  : isOwnMessage 
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-200'
            } rounded-2xl ${message.file ? '' : message.decryption_status === 'key_unavailable' || message.decryption_status === 'failed' ? '' : 'px-4 py-3'} max-w-full break-words`}>
              {renderContent()}
            </div>
            
            {isOwnMessage && (
              <div className={`flex items-center mt-1 gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 flex items-center justify-center ${message.seen ? 'text-sky-600' : 'text-sky-400'}`}>
                    <svg width="12" height="12" viewBox="0 0 16 16" className="fill-current">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </div>
                  
                  {message.seen && (
                    <div className="w-3 h-3 flex items-center justify-center -ml-1.5 text-sky-600">
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