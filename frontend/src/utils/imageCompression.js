export async function compressImage(file, maxSizeMB = 10) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.sqrt((maxSizeMB * 1024 * 1024) / file.size);
      const width = img.width * Math.min(1, scale);
      const height = img.height * Math.min(1, scale);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob.size > maxSizeMB * 1024 * 1024) {
            reject(new Error('Image is too large even after compression.'));
          } else {
            resolve(new File([blob], file.name, { type: blob.type }));
          }
        },
        file.type,
        0.7
      );
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
