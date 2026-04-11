// src/lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import { Readable }         from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = (buffer, mimetype, requestId) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype === 'application/pdf' ? 'raw' : 'image'

    const stream = cloudinary.upload_stream(
      {
        folder:        `credentialing/${requestId}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    Readable.from(buffer).pipe(stream)
  })
}

export const deleteFromCloudinary = (publicId, resourceType = 'image') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}