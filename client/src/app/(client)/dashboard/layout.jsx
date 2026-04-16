"use client";
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { useAuth } from "../../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar";


export default function ClientLayout({ children }) {
  const { user, loading, isClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace("/sign-in"); return }
    if (!isClient) { router.replace("/admin/dashboard"); return }
  }, [user, loading, isClient])

  // Show nothing while checking — prevents flash of protected content
  if (!isClient) { router.replace("/admin/dashboard"); return }
  if (loading) return <p>Loading...</p>

  return (
    <SidebarProvider>
      <DashboardSidebar>
      <Navbar />
        <main>
          {children}
        </main>
      </DashboardSidebar>
    </SidebarProvider>
  )
}