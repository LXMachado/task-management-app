"use client"

import { useTheme } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ThemeTest() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
        <CardDescription>Test that theme switching is working correctly with improved contrast</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p>
              Current theme: <strong>{theme}</strong>
            </p>
            <p className="text-sm text-muted-foreground">This value should persist across page reloads</p>
          </div>
          <div className="flex gap-2">
            <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button variant={theme === "system" ? "default" : "outline"} size="sm" onClick={() => setTheme("system")}>
              <Monitor className="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background border rounded-md">
            <p className="font-medium">Background</p>
            <p className="text-sm text-muted-foreground">bg-background</p>
          </div>
          <div className="p-4 bg-foreground text-background border rounded-md">
            <p className="font-medium">Foreground</p>
            <p className="text-sm opacity-80">bg-foreground</p>
          </div>
          <div className="p-4 bg-card border rounded-md">
            <p className="font-medium">Card</p>
            <p className="text-sm text-muted-foreground">bg-card</p>
          </div>
          <div className="p-4 bg-primary text-primary-foreground border rounded-md">
            <p className="font-medium">Primary</p>
            <p className="text-sm opacity-80">bg-primary</p>
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground border rounded-md">
            <p className="font-medium">Secondary</p>
            <p className="text-sm opacity-80">bg-secondary</p>
          </div>
          <div className="p-4 bg-muted text-muted-foreground border rounded-md">
            <p className="font-medium">Muted</p>
            <p className="text-sm opacity-80">bg-muted</p>
          </div>
          <div className="p-4 bg-kanban text-kanban-foreground border rounded-md">
            <p className="font-medium">Kanban Column</p>
            <p className="text-sm opacity-80">bg-kanban</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Priority Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="priority-badge-low">
              Low
            </Badge>
            <Badge variant="outline" className="priority-badge-medium">
              Medium
            </Badge>
            <Badge variant="outline" className="priority-badge-high">
              High
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Status Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="status-badge-todo">
              To Do
            </Badge>
            <Badge variant="outline" className="status-badge-inProgress">
              In Progress
            </Badge>
            <Badge variant="outline" className="status-badge-done">
              Done
            </Badge>
          </div>
        </div>

        <div className="p-4 bg-kanban text-kanban-foreground rounded-lg border">
          <h3 className="font-medium mb-2">Kanban Column Example</h3>
          <div className="bg-background/50 text-foreground text-sm p-3 rounded-md mb-2">
            Task card example with improved contrast
          </div>
          <div className="text-muted-foreground text-sm">Column content with better readability</div>
        </div>
      </CardContent>
    </Card>
  )
}

