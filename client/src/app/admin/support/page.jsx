"use client"
import { useState, useEffect } from "react"
import { PageHeader }          from "@/components/layout/PageHeader"
import { Badge }               from "@/components/ui/Badge"
import { Button }              from "@/components/ui/Button"
import api                     from "@/lib/api"

export default function AdminSupportPage() {
  const [tickets, setTickets]   = useState([])
  const [filter, setFilter]     = useState("open")
  const [loading, setLoading]   = useState(true)
  const [resolving, setResolving] = useState(null)

  const fetchTickets = () => {
    setLoading(true)
    const q = filter === "open" ? "?resolved=false" : filter === "resolved" ? "?resolved=true" : ""
    api.get(`/api/admin/support${q}`)
      .then(r => setTickets(r.data.tickets))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTickets() }, [filter])

  const handleResolve = async (id) => {
    setResolving(id)
    try {
      await api.patch(`/api/admin/support/${id}/resolve`)
      fetchTickets()
    } finally {
      setResolving(null)
    }
  }

  return (
    <div>
      <PageHeader title="Support tickets" subtitle="Client support requests" />

      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {[["open", "Open"], ["resolved", "Resolved"], ["", "All"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: "5px 12px", fontSize: "12px", borderRadius: "20px", cursor: "pointer",
            border: "0.5px solid var(--color-border-tertiary)",
            background: filter === val ? "#0d3d3d" : "var(--color-background-primary)",
            color:      filter === val ? "#fff"    : "var(--color-text-secondary)",
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {loading
          ? <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Loading...</p>
          : tickets.length === 0
          ? <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>No tickets found.</p>
          : tickets.map(t => (
            <div key={t._id} style={{
              background: "var(--color-background-primary)", borderRadius: "10px",
              border: "0.5px solid var(--color-border-tertiary)", padding: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>{t.subject}</p>
                  <Badge label={t.is_resolved ? "Resolved" : "Open"} variant={t.is_resolved ? "resolved" : "open"} />
                </div>
                <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--color-text-tertiary)" }}>
                {t.client_id?.user_id?.name} · {t.client_id?.company_name}
              </p>
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                {t.message}
              </p>
              {!t.is_resolved && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleResolve(t._id)}
                  disabled={resolving === t._id}
                >
                  {resolving === t._id ? "Resolving..." : "Mark resolved"}
                </Button>
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}