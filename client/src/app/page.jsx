// app/page.jsx
"use client"
import { useAuth }  from "../../context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user)                       router.replace("/sign-in")
    else if (user.role === "admin")  router.replace("/admin/dashboard")
    else                             router.replace("/dashboard")
  }, [user, loading])

  return null   // renders nothing — just redirects
}