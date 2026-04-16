"use client"
import { useState }  from "react"
import { useRouter } from "next/navigation"
import { Input }     from "@/components/ui/Input"
import { Button }    from "@/components/ui/Button"
import api           from "@/lib/api"

const SPECIALTIES = [
  "Cardiology", "Radiology", "Pediatrics", "Surgery",
  "Neurology", "Oncology", "Orthopedics", "Dermatology",
]

export function RequestForm() {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [form, setForm]       = useState({
    provider_name: "",
    specialty:     "",
    notes:         "",
  })

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      await api.post("/api/requests", form)
      router.push("/requests")
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "540px", margin: "0 auto" }}>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 500,
              background: step >= n ? "#0d3d3d" : "var(--color-background-secondary)",
              color:      step >= n ? "#fff"    : "var(--color-text-tertiary)",
              border:     "0.5px solid var(--color-border-tertiary)",
            }}>
              {n}
            </div>
            {n < 3 && (
              <div style={{
                width: "40px", height: "1px",
                background: step > n
                  ? "#0d3d3d"
                  : "var(--color-border-tertiary)",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Provider info */}
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
          <Button
            fullWidth
            onClick={() => {
              if (!form.provider_name || !form.specialty) {
                setError("Please fill all fields")
                return
              }
              setError("")
              setStep(2)
            }}
          >
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2 — Additional notes */}
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
            <Button fullWidth onClick={() => { setError(""); setStep(3) }}>
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Review and submit */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "20px" }}>
            Review and submit
          </h2>
          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "8px", padding: "16px", marginBottom: "20px",
          }}>
            {[
              ["Provider", form.provider_name],
              ["Specialty", form.specialty],
              ["Notes", form.notes || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
              }}>
                <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{k}</span>
                <span style={{ fontSize: "13px", fontWeight: 500, maxWidth: "60%", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          {error && (
            <p style={{ fontSize: "12px", color: "var(--color-text-danger)", marginBottom: "12px" }}>
              {error}
            </p>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
            <Button fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit request"}
            </Button>
          </div>
        </div>
      )}

      {error && step !== 3 && (
        <p style={{ fontSize: "12px", color: "var(--color-text-danger)", marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  )
}