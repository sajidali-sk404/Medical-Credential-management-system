"use client"
import { useState, useEffect } from "react"
import { PageHeader }          from "@/components/layout/PageHeader"
import { RequestsTable }       from "@/components/dashboard/RequestsTable"
import { Button }              from "@/components/ui/button"
import api                     from "@/lib/axios"
import Link                    from "next/link"

const STATUS_OPTS = ["", "pending", "in_review", "approved", "rejected"]

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [status, setStatus]     = useState("")
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    const q = status ? `?status=${status}` : ""
    api.get(`/api/requests/my${q}`)
      .then(r => setRequests(r.data.requests))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <div>
      <PageHeader
        title="My requests"
        subtitle="All your credentialing submissions"
        action={
          <Link href="/dashboard/new-request"><Button>+ New request</Button></Link>
        }
      />

      <div className="flex gap-3 text-2xl mb-2 ">
        {STATUS_OPTS.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: "5px 12px", fontSize: "16px", borderRadius: "20px", cursor: "pointer",
              border: "0.5px solid var(--color-border-tertiary)",
              background: status === s ? "#0d3d3d" : "var(--color-background-primary)",
              color:      status === s ? "#fff"    : "var(--color-text-secondary)",
            }}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div style={{
        background: "var(--color-background-primary)",
        borderRadius: "10px",
        border: "0.5px solid var(--color-border-tertiary)",
        padding: "20px",
      }}>
        {loading
          ? <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Loading...</p>
          : <RequestsTable requests={requests} basePath="/dashboard/requests" />
        }
      </div>
    </div>
  )
}