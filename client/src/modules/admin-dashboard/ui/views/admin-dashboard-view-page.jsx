"use client"
import { useState, useEffect } from "react"
import { PageHeader }          from "@/components/layout/PageHeader"
import { StatCard }            from "@/components/dashboard/StatCard"
import { RequestsTable }       from "@/components/dashboard/RequestsTable"
import api                     from "@/lib/axios"

export default function AdminDashboardPage() {
  const [stats, setStats]       = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/dashboard/stats"),
      api.get("/api/admin/requests?limit=8"),
    ]).then(([s, r]) => {
      setStats(s.data)
      setRequests(r.data.requests)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: "var(--color-text-tertiary)" }}>Loading...</p>

  return (
    <div>
      <PageHeader title="Admin dashboard" subtitle="Platform-wide overview" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
        <StatCard icon="./filebage.svg" label="Total requests"  value={stats?.total}        color="default" />
        <StatCard icon="./pendingfile.svg" label="Pending"         value={stats?.pending}      color="warning" />
        <StatCard icon="./approvedfile.svg" label="Approved"        value={stats?.approved}     color="success" />
        <StatCard icon="./openticketsfile.svg" label="Open tickets"    value={stats?.open_tickets} color="danger"  />
      </div>

      <div style={{
        background: "var(--color-background-primary)",
        borderRadius: "10px", border: "0.5px solid var(--color-border-tertiary)",
        padding: "20px",
      }}>
        <p style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 500 }}>
          Recent requests
        </p>
        <RequestsTable requests={requests} basePath="/admin/requests" />
      </div>
    </div>
  )
}