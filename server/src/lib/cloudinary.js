import { v2 as cloudinary } from "cloudinary"
import { Readable } from "stream"
import path from "path"

// ── CONFIG ───────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── UPLOAD ───────────────────────────────────
export const uploadToCloudinary = async ({
  buffer,
  mimetype,
  originalname,
  folder = "uploads",
}) => {
  return new Promise((resolve, reject) => {
    try {
      // ✅ auto detect resource type (BEST PRACTICE)
      const resourceType = "auto"

      // ✅ clean file name
      const ext = path.extname(originalname)
      const baseName = path.basename(originalname, ext)
      const publicId = `${Date.now()}-${baseName}`

      const uploadOptions = {
        folder,
        resource_type: resourceType,
        public_id: publicId,
      }

      // ✅ optimize images only
      if (mimetype.startsWith("image/")) {
        uploadOptions.transformation = [
          { quality: "auto", fetch_format: "auto" },
        ]
      }

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject({
              message: "Cloudinary upload failed",
              error,
            })
          }

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
          })
        }
      )

      Readable.from(buffer).pipe(stream)

    } catch (err) {
      reject({
        message: "Upload processing failed",
        error: err,
      })
    }
  })
}

// ── DELETE ───────────────────────────────────
export const deleteFromCloudinary = async ({
  publicId,
  resourceType = "auto",
}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    return result
  } catch (error) {
    throw {
      message: "Failed to delete file",
      error,
    }
  }
}