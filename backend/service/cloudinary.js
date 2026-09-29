const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url) {
  // Remove everything before /upload/
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  // Remove version number if present
  let publicIdWithExt = parts[1].split("/").slice(1).join("/");

  // Drop extension (.jpg, .png, etc.)
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
  return publicId;
}

module.exports = { cloudinary, extractPublicId };
