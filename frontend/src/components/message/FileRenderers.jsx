import { Download, File } from 'lucide-react';

export function PDFRenderer({ message }) {
  const { file } = message;
  const url = file.url;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
        <File className="text-red-500" size={24} />
        <div className="flex-1">
          <p className="font-medium text-gray-800">{file.filename}</p>
          <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      </div>
      <div className="bg-yellow-100 rounded-lg p-3">
        <div className="flex flex-col space-y-2">
          <button 
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.download = file.filename;
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
                        <title>${file.filename}</title>
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
                            <h1>${file.filename}</h1>
                            <p>PDF Document - ${(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <div class="pdf-content">
                            <iframe src="${url}" type="application/pdf" onerror="this.style.display='none'; document.getElementById('fallback').style.display='block';">
                              <div id="fallback" class="fallback" style="display: none;">
                                <h2>PDF Preview Failed</h2>
                                <p>This PDF cannot be displayed in the browser.</p>
                                <a href="${url}" download="${file.filename}" class="download-btn">Download PDF</a>
                              </div>
                            </iframe>
                            <div id="fallback" class="fallback" style="display: none;">
                              <h2>PDF Preview Failed</h2>
                              <p>This PDF cannot be displayed in the browser.</p>
                              <a href="${url}" download="${file.filename}" class="download-btn">Download PDF</a>
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

export function ImageRenderer({ message }) {
  const { file } = message;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <img 
        src={file.url} 
        alt={file.filename}
        className="w-full max-w-sm h-auto object-cover max-w-[90vw] sm:max-w-sm"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div 
        className="hidden w-full max-w-sm rounded-2xl shadow-md bg-sky-50 border border-sky-200 p-4 text-center max-w-[90vw] sm:max-w-sm"
      >
        <p className="text-sky-700 font-medium">Failed to load image</p>
        <a 
          href={file.url} 
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

export function VideoRenderer({ message }) {
  const { file } = message;

  return (
    <div className="w-full max-w-xs rounded-lg shadow-md bg-blue-50 p-2 max-w-[90vw] sm:max-w-xs">
      <video 
        controls 
        className="w-full rounded max-w-[90vw] sm:max-w-xs"
        preload="metadata"
      >
        <source src={file.url} type={file.mimetype} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function AudioRenderer({ message }) {
  const { file } = message;

  return (
    <div className="w-full flex items-center justify-center bg-purple-50 rounded-lg p-2">
      <audio
        controls
        preload="metadata"
        className="h-10 bg-white border border-gray-300 rounded"
        style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: 260 }}
      >
        <source src={file.url} type={file.mimetype} />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}

export function GenericFileRenderer({ message }) {
  const { file } = message;

  return (
    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
      <File className="text-gray-500" size={24} />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{file.filename}</p>
        <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <a 
        href={file.url} 
        download={file.filename}
        className="text-blue-500 hover:text-blue-600"
      >
        <Download size={20} />
      </a>
    </div>
  );
}
