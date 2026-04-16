"use client"
import { useState, useEffect } from "react"
import { use }                 from "react"
import { PageHeader }          from "@/components/layout/PageHeader"
import { Badge }               from "@/components/ui/Badge"
import { Button }              from "@/components/ui/Button"
import { StatusTimeline }      from "@/components/StatusTimeline"
import api                     from "@/lib/axios"

const NEXT_STATUS = {
  pending:   ["in_review"],
  in_review: ["approved", "rejected"],
  approved:  [],
  rejected:  [],
}

export default function AdminRequestDetailPage({ params }) {
  const { id }                = use(params)
  const [request, setRequest] = useState(null)
  const [logs, setLogs]       = useState([])
  const [docs, setDocs]       = useState([])
  const [note, setNote]       = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchRequest = () => {
    api.get(`/api/admin/requests/${id}`)
      .then(r => {
        setRequest(r.data)
        setLogs(r.data.status_logs)
        setDocs(r.data.documents)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRequest() }, [id])

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await api.patch(`/api/admin/requests/${id}/status`, { status: newStatus, note })
      setNote("")
      fetchRequest()
    } catch (err) {
      alert(err.response?.data?.message || "Update failed")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <p style={{ color: "var(--color-text-tertiary)" }}>Loading...</p>
  if (!request) return <p>Request not found.</p>

  const nextStatuses = NEXT_STATUS[request.status] || []

  return (
    <div>
      <PageHeader
        title={request.provider_name}
        subtitle={`${request.specialty} · ${request.client_id?.user_id?.name || "Unknown client"}`}
        action={<Badge label={request.status.replace("_", " ")} variant={request.status} />}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>

        {/* Left — documents + status update */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Status update panel */}
          {nextStatuses.length > 0 && (
            <div style={{
              background: "var(--color-background-primary)", borderRadius: "10px",
              border: "0.5px solid var(--color-border-tertiary)", padding: "20px",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 500 }}>
                Update status
              </p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note (optional)..."
                rows={2}
                style={{
                  width: "100%", padding: "8px 12px", fontSize: "12px",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "7px", background: "var(--color-background-secondary)",
                  color: "var(--color-text-primary)", outline: "none",
                  resize: "vertical", boxSizing: "border-box", marginBottom: "10px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                {nextStatuses.map(s => (
                  <Button
                    key={s}
                    variant={s === "rejected" ? "danger" : "primary"}
                    onClick={() => handleStatusUpdate(s)}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : `Mark ${s.replace("_", " ")}`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div style={{
            background: "var(--color-background-primary)", borderRadius: "10px",
            border: "0.5px solid var(--color-border-tertiary)", padding: "20px",
          }}>
            <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 500 }}>
              Uploaded documents ({docs.length})
            </p>
            {docs.length === 0
              ? <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>No documents.</p>
              : docs.map(doc => (
                <div key={doc._id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}>
                  <div style={{
                    width: "32px", height: "36px", borderRadius: "4px",
                    background: doc.file_type === "application/pdf"
                      ? "var(--color-background-danger)" : "var(--color-background-info)",
                    color: doc.file_type === "application/pdf"
                      ? "var(--color-text-danger)" : "var(--color-text-info)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: 500,
                  }}>
                    {doc.file_type === "application/pdf" ? "PDF" : "IMG"}
                  </div>
                  <span style={{ flex: 1, fontSize: "12px", fontWeight: 500 }}>{doc.file_name}</span>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontSize: "11px", color: "var(--color-text-info)",
                      border: "0.5px solid var(--color-border-info)",
                      padding: "3px 8px", borderRadius: "5px", textDecoration: "none",
                    }}>
                    View
                  </a>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right — timeline */}
        <div style={{
          background: "var(--color-background-primary)", borderRadius: "10px",
          border: "0.5px solid var(--color-border-tertiary)", padding: "20px",
        }}>
          <p style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 500 }}>Status history</p>
          <StatusTimeline logs={logs} />
        </div>
      </div>
    </div>
  )
}