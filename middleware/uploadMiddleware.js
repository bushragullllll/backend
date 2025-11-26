import multer from "multer";
import path from "path";

// ✅ Define storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // saves files in /uploads
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // unique file name
  },
});

// ✅ File filter (only allow some types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|pdf|docx|pptx|xlsx|zip/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only specific file types allowed!"));
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
