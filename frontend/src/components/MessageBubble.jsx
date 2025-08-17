import { Download, File } from 'lucide-react';
import { useState } from 'react';

export default function MessageBubble({ message, isOwnMessage, senderName }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInitials = (fullname) => {
    if (!fullname || fullname.trim() === '') return 'U';
    return fullname
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (message.file) {
      const filename = message.file.filename?.toLowerCase() || '';
      const mimetype = message.file.mimetype?.toLowerCase() || '';
      const url = message.file.url;

      // PDF: check first, before image
      const isPDF = filename.endsWith('.pdf') || mimetype === 'application/pdf' || mimetype === 'pdf' || (url && url.toLowerCase().endsWith('.pdf'));
      if (isPDF) {
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
              <File className="text-red-500" size={24} />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{message.file.filename}</p>
                <p className="text-sm text-gray-600">{(message.file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <div className="flex flex-col space-y-2">
                <button 
                  className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = message.file.filename;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
                <button 
                  className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    try {
                      window.open(url, '_blank');
                    } catch (error) {
                      const newWindow = window.open('', '_blank');
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head>
                              <title>${message.file.filename}</title>
                              <style>
                                body { margin: 0; padding: 0; height: 100vh; font-family: Arial, sans-serif; }
                                .pdf-container { width: 100%; height: 100%; display: flex; flex-direction: column; }
                                .pdf-header { background: #f3f4f6; padding: 1rem; border-bottom: 1px solid #d1d5db; }
                                .pdf-content { flex: 1; }
                                iframe { width: 100%; height: 100%; border: none; }
                                .fallback { padding: 2rem; text-align: center; }
                                .download-btn { background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; margin-top: 1rem; }
                              </style>
                            </head>
                            <body>
                              <div class="pdf-container">
                                <div class="pdf-header">
                                  <h1>${message.file.filename}</h1>
                                  <p>PDF Document - ${(message.file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <div class="pdf-content">
                                  <iframe src="${url}" type="application/pdf" onerror="this.style.display='none'; document.getElementById('fallback').style.display='block';">
                                    <div id="fallback" class="fallback" style="display: none;">
                                      <h2>PDF Preview Failed</h2>
                                      <p>This PDF cannot be displayed in the browser.</p>
                                      <a href="${url}" download="${message.file.filename}" class="download-btn">Download PDF</a>
                                    </div>
                                  </iframe>
                                  <div id="fallback" class="fallback" style="display: none;">
                                    <h2>PDF Preview Failed</h2>
                                    <p>This PDF cannot be displayed in the browser.</p>
                                    <a href="${url}" download="${message.file.filename}" class="download-btn">Download PDF</a>
                                  </div>
                                </div>
                              </div>
                            </body>
                          </html>
                        `);
                        newWindow.document.close();
                      }
                    }
                  }}
                >
                  <span>Open in New Tab</span>
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Image files
      const isImage = filename.match(/\.(jpg|jpeg|png|gif|webp)$/i) || mimetype.startsWith('image/');
      if (isImage) {
        return (
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={url} 
              alt={message.file.filename}
              className="max-w-sm w-full h-auto object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div 
              className="hidden max-w-sm rounded-2xl shadow-md bg-sky-50 border border-sky-200 p-4 text-center"
              style={{ display: 'none' }}
            >
              <p className="text-sky-700 font-medium">Failed to load image</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sky-600 hover:text-sky-700 underline text-sm"
              >
                Open in new tab
              </a>
            </div>
          </div>
        );
      }

      // Video files
      const isVideo = filename.match(/\.(mp4|webm|ogg)$/i) || mimetype.startsWith('video/');
      if (isVideo) {
        return (
          <div className="max-w-xs rounded-lg shadow-md bg-blue-50 p-2">
            <video 
              controls 
              className="w-full rounded"
              preload="metadata"
            >
              <source src={url} type={mimetype} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }

      // Audio files
      const isAudio = filename.match(/\.(mp3|wav|ogg)$/i) || mimetype.startsWith('audio/');
      if (isAudio) {
        return (
          <div className="w-full flex items-center justify-center bg-purple-50 rounded-lg p-2">
            <audio
              controls
              preload="metadata"
              className="h-10 bg-white border border-gray-300 rounded"
              style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: 260 }}
            >
              <source src={url} type={mimetype} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      }

      // Generic file
      return (
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
          <File className="text-gray-500" size={24} />
          <div className="flex-1">
            <p className="font-medium text-gray-800">{message.file.filename}</p>
            <p className="text-sm text-gray-600">{(message.file.size / 1024).toFixed(1)} KB</p>
          </div>
          <a 
            href={url} 
            download={message.file.filename}
            className="text-blue-500 hover:text-blue-600"
          >
            <Download size={20} />
          </a>
        </div>
      );
    }

    // Text messages - return just the text, styling will be handled by parent
    return (
      <span className="leading-relaxed">
        {message.text || message.content}
      </span>
    );
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-6 px-2 animate-sky-fade`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[70%] ${isOwnMessage ? 'ml-12' : 'mr-12'}`}>
        
        {/* Avatar - Properly aligned at the top */}
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

        {/* Message Content Container */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          
          {/* Sender Name - Show for both sent and received messages for clarity */}
          <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <p className="text-xs font-medium text-sky-700">
              {isOwnMessage ? 'You' : (message.sender?.fullname || senderName || 'Unknown')}
            </p>
            <p className="text-xs text-neutral-400">
              {formatTime(message.createdAt || message.timestamp)}
            </p>
          </div>

          {/* Message Bubble Container */}
          <div className={`relative ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
            
            {/* Message Bubble Tail */}
            <div className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} ${isOwnMessage ? '-mr-2' : '-ml-2'} top-4 w-0 h-0 ${
              isOwnMessage 
                ? 'border-l-8 border-l-sky-500 border-t-8 border-t-transparent border-b-8 border-b-transparent'
                : 'border-r-8 border-r-slate-100 border-t-8 border-t-transparent border-b-8 border-b-transparent'
            }`}></div>

            {/* Message Content with Better Styling */}
            <div className={`relative ${
              message.file 
                ? 'bg-transparent p-0' 
                : isOwnMessage 
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-200'
            } rounded-2xl ${message.file ? '' : 'px-4 py-3'} max-w-full break-words`}>
              {renderContent()}
            </div>
            
            {/* Message Status/Read Receipt - Compact design */}
            {isOwnMessage && (
              <div className={`flex items-center mt-1 gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {/* Compact checkmark indicators */}
                <div className="flex items-center">
                  {/* Single checkmark for delivered */}
                  <div className={`w-3 h-3 flex items-center justify-center ${message.seen ? 'text-sky-600' : 'text-sky-400'}`}>
                    <svg width="12" height="12" viewBox="0 0 16 16" className="fill-current">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </div>
                  
                  {/* Double checkmark for seen - overlapped for compact design */}
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