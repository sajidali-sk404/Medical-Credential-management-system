export function StatCard({ label, value, color = "info" }) {
  const colors = {
    info:    "var(--color-text-info)",
    warning: "var(--color-text-warning)",
    success: "var(--color-text-success)",
    danger:  "var(--color-text-danger)",
    default: "var(--color-text-primary)",
  }
  return (
    <div style={{
      background:   "var(--color-background-secondary)",
      borderRadius: "8px",
      padding:      "16px",
    }}>
      <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--color-text-tertiary)" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: "26px", fontWeight: 500, color: colors[color] }}>
        {value ?? "—"}
      </p>
    </div>
  )
}