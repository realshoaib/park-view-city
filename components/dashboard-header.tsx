"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings } from "lucide-react"
import { useAuth } from "@/app/contexts/auth-context"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  if (!user) return null

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.full_name.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Welcome back, {user.full_name.toUpperCase()}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
