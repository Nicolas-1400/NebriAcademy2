const streamifier = require("streamifier");
const cloudinary = require("../routes/cloudinary");

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_chunked_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function extractPublicId(url, resourceType) {
  try {
    const parts = url.split("/");
    const uploadIdx = parts.indexOf("upload");
    const afterUpload = parts.slice(uploadIdx + 2);
    const publicIdWithExt = afterUpload.join("/");
    return resourceType === "raw" ? publicIdWithExt : publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

function getResourceTypeFromUrl(url) {
  if (!url) return 'raw';
  if (url.includes('/image/upload/')) return 'image';
  if (url.includes('/video/upload/')) return 'video';
  return 'raw';
}

module.exports = {
  uploadToCloudinary,
  extractPublicId,
  getResourceTypeFromUrl,
};
