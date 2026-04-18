"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"

const SPECIALTIES = [
  "Cardiology", "Radiology", "Pediatrics", "Surgery",
  "Neurology", "Oncology", "Orthopedics", "Dermatology",
]


const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
const MAX_SIZE_MB = 10;

export function RequestForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [files, setFiles] = useState([])
  const [form, setForm] = useState({
    provider_name: "",
    specialty: "",
    notes: "",
  })

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))


  // ── File picker handler ─────────────────────────────────────────
  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files)
    const valid = []
    const errors = []

    picked.forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: only PDF, JPG, PNG, WEBP allowed`)
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name}: exceeds 10MB limit`)
      } else {
        valid.push(file)
      }
    })
    if (errors.length) { setError(errors.join(" · ")); return }
    setError("")
    setFiles(prev => [...prev, ...valid])
    e.target.value = ""   // reset so same file can be re-added if removed
  }

  const removeFile = (index) =>
    setFiles(prev => prev.filter((_, i) => i !== index))



  // ── Final submit — create request then upload any files ─────────
  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      // 1. Create the request — get back the new _id
      const { data: newRequest } = await api.post("/api/requests", form)

      // 2. Upload each file to the new request (parallel)
      if (files.length > 0) {
        await Promise.all(
          files.map(file => {
            const formData = new FormData()
            formData.append("document", file)
            return api.post(
              `/api/requests/${newRequest._id}/documents`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            )
          })
        )
      }

      router.push(`/dashboard/requests/${newRequest._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed")
    } finally {
      setLoading(false)
    }
  }



  return (
    <div style={{ maxWidth: "540px", margin: "0 auto" }}>

      {/* ── Step indicator ────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
        {[
          { n: 1, label: "Provider" },
          { n: 2, label: "Notes"    },
          { n: 3, label: "Documents"},
          { n: 4, label: "Review"   },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-1.5">
             <div className="flex flex-col items-center gap-1">
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 500,
                background: step >= n ? "#0d3d3d" : "var(--color-background-secondary)",
                color:      step >= n ? "#fff"    : "var(--color-text-tertiary)",
                border:     "0.5px solid var(--color-border-tertiary)",
              }}>
                {step > n ? "✓" : n}
              </div>
              <span style={{
                fontSize: "10px", color: step >= n
                  ? "var(--color-text-primary)"
                  : "var(--color-text-tertiary)",
                fontWeight: step === n ? 500 : 400,
              }}>
                {label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div style={{
                width: "36px", height: "1px", marginBottom: "16px",
                background: step > n ? "#0d3d3d" : "var(--color-border-tertiary)",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1 — Provider info ────────────────────────────── */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "20px" }}>
            Provider information
          </h2>

          <Input
            label="Provider name"
            placeholder="Dr. Bilal Raza"
            value={form.provider_name}
            onChange={update("provider_name")}
            required
          />

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 500,
              color: "var(--color-text-tertiary)", textTransform: "uppercase",
              letterSpacing: ".04em", marginBottom: "6px",
            }}>
              Specialty
            </label>
            <select
              value={form.specialty}
              onChange={update("specialty")}
              style={{
                width: "100%", padding: "10px 12px", fontSize: "13px",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "8px", background: "var(--color-background-secondary)",
                color: "var(--color-text-primary)", outline: "none",
              }}
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {error && <p style={{ fontSize: "12px", color: "var(--color-text-danger)", marginBottom: "10px" }}>{error}</p>}

          <Button  onClick={() => {
            if (!form.provider_name || !form.specialty) {
              setError("Please fill all required fields")
              return
            }
            setError("")
            setStep(2)
          }}>
            Continue →
          </Button>
        </div>
      )}

      {/* ── Step 2 — Additional notes ─────────────────────────── */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "20px" }}>
            Additional notes
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 500,
              color: "var(--color-text-tertiary)", textTransform: "uppercase",
              letterSpacing: ".04em", marginBottom: "6px",
            }}>
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={update("notes")}
              placeholder="Any additional context for the credentialing team..."
              rows={4}
              style={{
                width: "100%", padding: "10px 12px", fontSize: "13px",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "8px", background: "var(--color-background-secondary)",
                color: "var(--color-text-primary)", outline: "none",
                resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
            <Button  onClick={() => { setError(""); setStep(3) }}>
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3 — Upload documents ─────────────────────────── */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "4px" }}>
            Upload documents
          </h2>
          <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "20px" }}>
            PDF, JPG, PNG or WEBP · max 10MB each · optional
          </p>

          {/* Drop zone / file picker */}
          <label
            htmlFor="step-upload"
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "8px",
              padding:        "32px 20px",
              border:         "1px dashed var(--color-border-secondary)",
              borderRadius:   "10px",
              background:     "var(--color-background-secondary)",
              cursor:         "pointer",
              marginBottom:   "16px",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "8px",
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "20px",
            }}>
              ↑
            </div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>
              Click to select files
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-tertiary)" }}>
              or drag and drop
            </p>
          </label>

          <input
            id="step-upload"
            type="file"
            multiple
            accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* File list */}
          {files.length > 0 && (
            <div style={{
              border:       "0.5px solid var(--color-border-tertiary)",
              borderRadius: "8px",
              overflow:     "hidden",
              marginBottom: "16px",
            }}>
              {files.map((file, i) => (
                <div
                  key={i}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "10px",
                    padding:      "10px 12px",
                    borderBottom: i < files.length - 1
                      ? "0.5px solid var(--color-border-tertiary)"
                      : "none",
                    background: "var(--color-background-primary)",
                  }}
                >
                  {/* File type icon */}
                  <div style={{
                    width:          "32px",
                    height:         "36px",
                    borderRadius:   "4px",
                    flexShrink:     0,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontSize:       "9px",
                    fontWeight:     500,
                    background: file.type === "application/pdf"
                      ? "var(--color-background-danger)"
                      : "var(--color-background-info)",
                    color: file.type === "application/pdf"
                      ? "var(--color-text-danger)"
                      : "var(--color-text-info)",
                  }}>
                    {file.type === "application/pdf" ? "PDF" : "IMG"}
                  </div>

                  {/* Name + size */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: "12px", fontWeight: 500,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {file.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      background: "none", border: "none",
                      cursor: "pointer", fontSize: "16px",
                      color: "var(--color-text-tertiary)",
                      lineHeight: 1, padding: "2px 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p style={{ fontSize: "12px", color: "var(--color-text-danger)", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
            <Button  onClick={() => { setError(""); setStep(4) }}>
              {files.length > 0 ? `Continue with ${files.length} file${files.length > 1 ? "s" : ""}` : "Continue →"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4 — Review and submit ────────────────────────── */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "20px" }}>
            Review and submit
          </h2>

          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "8px", padding: "16px", marginBottom: "16px",
          }}>
            {[
              ["Provider",  form.provider_name],
              ["Specialty", form.specialty],
              ["Notes",     form.notes || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
              }}>
                <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{k}</span>
                <span style={{ fontSize: "13px", fontWeight: 500, maxWidth: "60%", textAlign: "right" }}>
                  {v}
                </span>
              </div>
            ))}

            {/* Files summary */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0",
            }}>
              <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
                Documents
              </span>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                  : "None"}
              </span>
            </div>
          </div>

          {/* File names in review */}
          {files.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              {files.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "6px 0",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  fontSize: "12px", color: "var(--color-text-secondary)",
                }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>
                    {f.type === "application/pdf" ? "PDF" : "IMG"}
                  </span>
                  {f.name}
                  <span style={{ marginLeft: "auto", color: "var(--color-text-tertiary)", fontSize: "11px" }}>
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p style={{ fontSize: "12px", color: "var(--color-text-danger)", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setStep(3)}>← Back</Button>
            <Button  onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit request"}
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}