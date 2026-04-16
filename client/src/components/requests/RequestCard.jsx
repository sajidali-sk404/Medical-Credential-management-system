import Link      from "next/link"
import { Badge } from "@/components/ui/Badge"

export function RequestCard({ request, basePath = "/requests" }) {
  return (
    <div style={{
      background:   "var(--color-background-primary)",
      border:       "0.5px solid var(--color-border-tertiary)",
      borderRadius: "10px",
      padding:      "16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>
          {request.provider_name}
        </p>
        <Badge label={request.status.replace("_", " ")} variant={request.status} />
      </div>
      <p style={{ margin: "0 0 12px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
        {request.specialty}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
          {new Date(request.submitted_at).toLocaleDateString()}
        </span>
        <Link
          href={`${basePath}/${request._id}`}
          style={{
            fontSize: "12px", color: "var(--color-text-info)",
            border: "0.5px solid var(--color-border-info)",
            padding: "4px 10px", borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          View details
        </Link>
      </div>
    </div>
  )
}