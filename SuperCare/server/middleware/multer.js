import multer from "multer";

// memoryStorage keeps the file in RAM as a buffer.
// This is required for serverless platforms (Vercel) which have no
// persistent filesystem — diskStorage files are deleted before Cloudinary reads them.
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;