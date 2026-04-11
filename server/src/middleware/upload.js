// middleware/upload.js
import multer from 'multer'

// ── memoryStorage — file lives in RAM as a Buffer ─────────────────
// Never written to disk. Buffer is piped directly to Cloudinary,
// then garbage collected. Server stays completely stateless.
const storage = multer.memoryStorage()

// ── File type whitelist ───────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)    // accept
  } else {
    cb(new Error('Only PDF and image files are allowed'), false)  // reject
  }
}

// ── Multer instance ───────────────────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,   // 10MB max per file
    files:    1,                   // only one file per request
  },
})