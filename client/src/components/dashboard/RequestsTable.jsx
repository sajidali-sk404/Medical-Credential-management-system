"use client"
import Link        from "next/link"
import { Badge }   from "@/components/ui/Badge"

export function RequestsTable({ requests = [], basePath = "/requests" }) {
  if (requests.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "48px 0",
        color: "var(--color-text-tertiary)", fontSize: "13px",
      }}>
        No requests found.
      </div>
    )
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontSize: "13px", tableLayout: "fixed",
      }}>
        <thead>
          <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            {["Provider", "Specialty", "Status", "Submitted", ""].map(h => (
              <th key={h} style={{
                textAlign: "left", padding: "8px 12px",
                fontSize: "11px", fontWeight: 500,
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase", letterSpacing: ".04em",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr
              key={req._id}
              style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}
            >
              <td style={{ padding: "12px", fontWeight: 500 }}>
                {req.provider_name}
              </td>
              <td style={{ padding: "12px", color: "var(--color-text-secondary)" }}>
                {req.specialty}
              </td>
              <td style={{ padding: "12px" }}>
                <Badge label={req.status.replace("_", " ")} variant={req.status} />
              </td>
              <td style={{ padding: "12px", color: "var(--color-text-tertiary)", fontSize: "12px" }}>
                {new Date(req.submitted_at).toLocaleDateString()}
              </td>
              <td style={{ padding: "12px", textAlign: "right" }}>
                <Link
                  href={`/dashboard${basePath}/${req._id}`}
                  style={{
                    fontSize: "12px", color: "var(--color-text-info)",
                    border: "0.5px solid var(--color-border-info)",
                    padding: "4px 10px", borderRadius: "6px",
                    textDecoration: "none",
                  }}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}