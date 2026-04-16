"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { useAuth }  from "../../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Layout({ children }) {
  const { user, loading, isClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user)     { router.replace("/sign-in");         return }
    if (!isClient) { router.replace("/admin/dashboard"); return }
  }, [user, loading, isClient])

  // Show nothing while checking — prevents flash of protected content
  if (loading || !isClient) return null

  return (
    <SidebarProvider>
      <DashboardSidebar>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </DashboardSidebar>
    </SidebarProvider>
  )
}