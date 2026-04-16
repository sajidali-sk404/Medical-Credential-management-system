"use client"
import { useState, useEffect } from "react"
import { PageHeader }          from "@/components/layout/PageHeader"
import { Badge }               from "@/components/ui/Badge"
import Link                    from "next/link"
import api                     from "@/lib/api"

export default function AdminClientsPage() {
  const [clients, setClients] = useState([])
  const [search, setSearch]   = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = search ? `?search=${search}` : ""
    setLoading(true)
    api.get(`/api/admin/clients${q}`)
      .then(r => setClients(r.data.clients))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div>
      <PageHeader title="Client management" subtitle={`${clients.length} registered clients`} />

      <input
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "320px", padding: "9px 12px", fontSize: "13px",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "8px", background: "var(--color-background-primary)",
          color: "var(--color-text-primary)", outline: "none", marginBottom: "16px",
          boxSizing: "border-box",
        }}
      />

      <div style={{
        background: "var(--color-background-primary)", borderRadius: "10px",
        border: "0.5px solid var(--color-border-tertiary)", padding: "20px",
      }}>
        {loading
          ? <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Loading...</p>
          : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  {["Name", "Email", "Company", "Requests", "Joined", ""].map(h => (
                    <th key={h} style={{
                      textAlign: "left", padding: "8px 12px",
                      fontSize: "11px", color: "var(--color-text-tertiary)",
                      fontWeight: 500, textTransform: "uppercase",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c._id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                    <td style={{ padding: "12px", fontWeight: 500 }}>{c.user_id?.name}</td>
                    <td style={{ padding: "12px", color: "var(--color-text-secondary)" }}>{c.user_id?.email}</td>
                    <td style={{ padding: "12px" }}>{c.company_name}</td>
                    <td style={{ padding: "12px" }}>{c.request_count ?? 0}</td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "var(--color-text-tertiary)" }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <Link href={`/admin/clients/${c._id}`} style={{
                        fontSize: "12px", color: "var(--color-text-info)",
                        border: "0.5px solid var(--color-border-info)",
                        padding: "4px 10px", borderRadius: "6px", textDecoration: "none",
                      }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  )
}