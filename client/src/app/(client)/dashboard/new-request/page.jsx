import { PageHeader } from "@/components/layout/PageHeader"
import { RequestForm } from "@/components/requests/RequestForm"

export default function NewRequestPage() {
  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <PageHeader
        title="New Credentialing Request"
        subtitle="Submit a new provider for credentialing review"
      />

      {/* Form Card */}
      <div className="
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        shadow-sm
        p-6 md:p-8
        max-w-3xl mx-auto
      ">
        <RequestForm />
      </div>

    </div>
  )
}