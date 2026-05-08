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
      className="mt-3 p-4 border-2 border-dashed rounded-[20px] shadow-lg transition-all"
      style={{ 
        position: 'absolute', 
        bottom: '70px', 
        left: 0, 
        right: 0, 
        zIndex: 20, 
        maxWidth: '500px', 
        margin: '0 auto',
        borderColor: isDragOver ? 'var(--accent-primary)' : 'var(--border-input)',
        background: isDragOver ? 'var(--bg-surface-active)' : 'var(--bg-surface-solid)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
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
            <p className="text-sm font-medium text-themed-primary" style={{ color: 'var(--text-primary)' }}>
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </p>
            {isUploading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
                <span className="text-sm text-themed-tertiary" style={{ color: 'var(--text-tertiary)' }}>Uploading...</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded-xl" style={{ background: 'var(--bg-surface-hover)' }}>
                <File size={16} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
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
          <div className="mb-2" style={{ color: 'var(--accent-primary)' }}>
            <Paperclip size={32} className="mx-auto" />
          </div>
          <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
            {isDragOver ? (
              <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>Drop files here to send</span>
            ) : (
              <>
                Drag and drop files here or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold underline"
                  data-testid="button-browse-files"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  browse
                </button>
              </>
            )}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Supports: Images, PDFs, Documents, Text files
          </p>
        </div>
      )}
    </div>
  );
}
