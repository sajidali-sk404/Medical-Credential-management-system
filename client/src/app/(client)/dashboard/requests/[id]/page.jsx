"use client"
import { useState, useEffect } from "react"
import { use } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { StatusTimeline } from "@/components/StatusTimeLine"
import { DocumentUpload } from "@/components/DocumentUpload"
import api from "@/lib/axios"

export default function RequestDetailPage({ params }) {
    const { id } = use(params)
    const [request, setRequest] = useState(null)
    const [documents, setDocuments] = useState([])
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRequest = () => {
        api.get(`/api/requests/${id}`)
            .then(r => {
                setRequest(r.data)
                setDocuments(r.data.documents)
                setLogs(r.data.status_logs)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchRequest() }, [id])

    if (loading) return <p style={{ color: "var(--color-text-tertiary)" }}>Loading...</p>
    if (!request) return <p>Request not found.</p>

    return (
        <div>
            <PageHeader
                title={request.provider_name}
                subtitle={request.specialty}
                action={<Badge label={request.status.replace("_", " ")} variant={request.status} />}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>

                {/* Left — documents */}
                <div style={{
                    background: "var(--color-background-primary)",
                    borderRadius: "10px", border: "0.5px solid var(--color-border-tertiary)",
                    padding: "20px",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>Documents</p>
                        <DocumentUpload
                            requestId={id}
                            onUploaded={(doc) => setDocuments(prev => [...prev, doc])}
                        />
                    </div>

                    {documents.length === 0 ? (
                        <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>
                            No documents uploaded yet.
                        </p>
                    ) : (
                        documents.map(doc => (
                            <div key={doc._id} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)",
                            }}>
                                <div style={{
                                    width: "32px", height: "36px", borderRadius: "4px",
                                    background: doc.file_type === "application/pdf"
                                        ? "var(--color-background-danger)"
                                        : "var(--color-background-info)",
                                    color: doc.file_type === "application/pdf"
                                        ? "var(--color-text-danger)"
                                        : "var(--color-text-info)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "9px", fontWeight: 500, flexShrink: 0,
                                }}>
                                    {doc.file_type === "application/pdf" ? "PDF" : "IMG"}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: "12px", fontWeight: 500 }}>{doc.file_name}</p>
                                    <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                                        {new Date(doc.uploaded_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <a
                                    href={doc.file_url.replace("/upload/", "/upload/fl_inline/")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: "11px", color: "var(--color-text-info)",
                                        border: "0.5px solid var(--color-border-info)",
                                        padding: "3px 8px", borderRadius: "5px", textDecoration: "none",
                                    }}
                                >
                                    View
                                </a>
                            </div>
                        ))
                    )}
                </div>

                {/* Right — status timeline */}
                <div style={{
                    background: "var(--color-background-primary)",
                    borderRadius: "10px", border: "0.5px solid var(--color-border-tertiary)",
                    padding: "20px",
                }}>
                    <p style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 500 }}>Status history</p>
                    <StatusTimeline logs={logs} />
                </div>
            </div>
        </div>
    )
}