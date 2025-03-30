"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface GoogleCalendarIntegrationProps {
  isConnected?: boolean
}

export function GoogleCalendarIntegration({ isConnected = false }: GoogleCalendarIntegrationProps) {
  const [connected, setConnected] = useState(isConnected)
  const [syncEnabled, setSyncEnabled] = useState(true)

  // This would be replaced with actual OAuth flow in a real implementation
  const handleConnect = () => {
    // Simulate OAuth flow
    setTimeout(() => {
      setConnected(true)
    }, 1000)
  }

  const handleDisconnect = () => {
    setConnected(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Google Calendar</CardTitle>
          </div>
          {connected ? (
            <div className="flex items-center text-sm text-green-600 dark:text-green-500">
              <Check className="mr-1 h-4 w-4" />
              Connected
            </div>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <X className="mr-1 h-4 w-4" />
              Not connected
            </div>
          )}
        </div>
        <CardDescription>
          Sync your tasks with Google Calendar to keep everything organized in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sync-tasks">Sync tasks to calendar</Label>
                <p className="text-sm text-muted-foreground">Create events in Google Calendar when tasks are created</p>
              </div>
              <Switch id="sync-tasks" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
            </div>
            <div className="text-sm text-muted-foreground">Last synced: {new Date().toLocaleString()}</div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Connect your Google Calendar to sync tasks and events between platforms.
          </div>
        )}
      </CardContent>
      <CardFooter>
        {connected ? (
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect}>Connect Google Calendar</Button>
        )}
      </CardFooter>
    </Card>
  )
}

