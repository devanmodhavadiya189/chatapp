import { PDFRenderer, ImageRenderer, VideoRenderer, AudioRenderer, GenericFileRenderer } from './FileRenderers';

export function renderFileContent(message) {
  if (!message.file) return null;

  const filename = message.file.filename?.toLowerCase() || '';
  const mimetype = message.file.mimetype?.toLowerCase() || '';
  const url = message.file.url;

  const isPDF = filename.endsWith('.pdf') || mimetype === 'application/pdf' || mimetype === 'pdf' || (url && url.toLowerCase().endsWith('.pdf'));
  if (isPDF) return <PDFRenderer message={message} />;

  const isImage = filename.match(/\.(jpg|jpeg|png|gif|webp)$/i) || mimetype.startsWith('image/');
  if (isImage) return <ImageRenderer message={message} />;

  const isVideo = filename.match(/\.(mp4|webm|ogg)$/i) || mimetype.startsWith('video/');
  if (isVideo) return <VideoRenderer message={message} />;

  const isAudio = filename.match(/\.(mp3|wav|ogg)$/i) || mimetype.startsWith('audio/');
  if (isAudio) return <AudioRenderer message={message} />;

  return <GenericFileRenderer message={message} />;
}
