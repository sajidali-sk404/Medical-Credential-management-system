import { PageHeader }  from "@/components/layout/PageHeader"
import { RequestForm } from "@/components/requests/RequestForm"

export default function NewRequestPage() {
  return (
    <div>
      <PageHeader
        title="New credentialing request"
        subtitle="Submit a new provider for credentialing review"
      />
      <div style={{
        background: "var(--color-background-primary)",
        borderRadius: "10px", border: "0.5px solid var(--color-border-tertiary)",
        padding: "32px",
      }}>
        <RequestForm />
      </div>
    </div>
  )
}