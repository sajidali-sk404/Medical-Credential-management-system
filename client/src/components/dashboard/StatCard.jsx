export function StatCard({ icon, label, value, color = "info" }) {
  const colors = {
    info:    "var(--color-text-info)",
    warning: "var(--color-text-warning)",
    success: "var(--color-text-success)",
    danger:  "var(--color-text-danger)",
    default: "var(--color-text-primary)",
  }
  const iconColors = {
    info: "bg-blue-300",
    pending: "bg-yellow-300",
    approved: "bg-green-300",
    rejected: "bg-red-300",
  }
  return (
    <div className="var(--color-background-secondary) border m-3 bg-white font-sans rounded-2xl p-5">
        <img className={`w-8 h-8 rounded p-1 mb-2 ${iconColors[label.toLowerCase()] || 'bg-blue-300'}`} src={icon} alt="img.svg" />
      <p className="var(--color-text-tertiary)">
        {label}
      </p>
      <p style={{ margin: 0, fontSize: "26px", fontWeight: 500, color: colors[color] }}>
        {value ?? "—"}
      </p>
    </div>
  )
}