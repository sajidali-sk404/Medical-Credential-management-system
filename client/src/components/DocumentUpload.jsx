"use client"
import { useState } from "react"
import api          from "@/lib/axios"

export function DocumentUpload({ requestId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState("")

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      setError("Only PDF, JPG, PNG, or WEBP files are allowed")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB")
      return
    }

    const formData = new FormData()
    formData.append("document", file)

    setUploading(true)
    setError("")
    try {
      const { data } = await api.post(
        `/api/requests/${requestId}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      onUploaded(data)
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div>
      <input
        type="file"
        id="doc-upload"
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={handleChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      <label
        htmlFor="doc-upload"
        style={{
          display:      "inline-flex",
          alignItems:   "center",
          gap:          "6px",
          padding:      "7px 14px",
          fontSize:     "12px",
          fontWeight:   500,
          border:       "0.5px solid var(--color-border-secondary)",
          borderRadius: "7px",
          cursor:       uploading ? "not-allowed" : "pointer",
          opacity:      uploading ? 0.5 : 1,
          color:        "var(--color-text-secondary)",
          background:   "var(--color-background-primary)",
        }}
      >
        {uploading ? "Uploading..." : "+ Upload document"}
      </label>
      {error && (
        <p style={{ fontSize: "11px", color: "var(--color-text-danger)", marginTop: "6px" }}>
          {error}
        </p>
      )}
    </div>
  )
}