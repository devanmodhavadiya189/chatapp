import { Paperclip, File, X } from 'lucide-react';

export default function FileUploadBox({
  showFileUpload,
  isDragOver,
  selectedFiles,
  isUploading,
  fileInputRef,
  fileUploadBoxRef,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  removeFile
}) {
  if (!showFileUpload) return null;

  return (
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
  );
}
