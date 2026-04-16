const DOT_COLORS = {
  pending:   "var(--color-text-warning)",
  in_review: "var(--color-text-info)",
  approved:  "var(--color-text-success)",
  rejected:  "var(--color-text-danger)",
}

export function StatusTimeline({ logs = [] }) {
  if (logs.length === 0) {
    return (
      <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>
        No status history yet.
      </p>
    )
  }

  return (
    <div>
      {logs.map((log, i) => (
        <div key={log._id} style={{ display: "flex", gap: "12px", paddingBottom: "16px" }}>
          {/* dot + connecting line */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0,
              background: DOT_COLORS[log.new_status] || "var(--color-text-tertiary)",
            }} />
            {i < logs.length - 1 && (
              <div style={{
                width: "1px", flex: 1, marginTop: "4px",
                background: "var(--color-border-tertiary)",
              }} />
            )}
          </div>

          {/* content */}
          <div style={{ paddingBottom: "4px", flex: 1 }}>
            <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 500 }}>
              {log.old_status
                ? `${log.old_status.replace("_", " ")} → ${log.new_status.replace("_", " ")}`
                : `Submitted as ${log.new_status}`}
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
              {new Date(log.changed_at).toLocaleString()}
            </p>
            {log.note && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                {log.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}