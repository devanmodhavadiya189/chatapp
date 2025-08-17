import { X, File } from 'lucide-react';

export default function MediaModal({ show, onClose, messages }) {
  if (!show) return null;
  const mediaMessages = messages.filter(m => m.file && m.file.url);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Shared Media</h2>
        <div className="grid grid-cols-3 gap-3">
          {mediaMessages.length === 0 && (
            <div className="col-span-3 text-gray-500 text-center">No media shared yet.</div>
          )}
          {mediaMessages.map((m, i) => (
            <a key={i} href={m.file.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                {m.file.mimetype && m.file.mimetype.startsWith('image/') ? (
                  <img src={m.file.url} alt={m.file.filename || 'media'} className="w-full h-24 object-cover" />
                ) : m.file.mimetype && m.file.mimetype.startsWith('audio/') ? (
                  <audio controls preload="metadata" className="w-full h-10">
                    <source src={m.file.url} type={m.file.mimetype || 'audio/mpeg'} />
                    Your browser does not support the audio element.
                  </audio>
                ) : m.file.mimetype && m.file.mimetype.startsWith('video/') ? (
                  <video controls preload="metadata" className="w-full h-24 object-cover">
                    <source src={m.file.url} type={m.file.mimetype || 'video/mp4'} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <File className="text-gray-400" size={32} />
                )}
              </div>
              <div className="truncate text-xs mt-1 text-gray-700 text-center">{m.file.filename || 'File'}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
