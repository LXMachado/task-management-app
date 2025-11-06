"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Filter, Sun, Moon } from "lucide-react"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { FilterTasksDialog } from "@/components/filter-tasks-dialog"
import { useTaskStore } from "@/lib/store"
import { useTheme } from "@/components/theme-provider"

export function TaskHeader() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const { tasks } = useTaskStore()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <p className="text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 dark:bg-secondary dark:hover:bg-secondary/80 dark:text-foreground"
          onClick={() => setFilterOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 dark:bg-secondary dark:hover:bg-secondary/80 dark:text-foreground"
          asChild
        >
          <Link href="/calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Link>
        </Button>
        <Button
          onClick={() => setCreateTaskOpen(true)}
          size="sm"
          className="h-9 dark:bg-primary dark:text-primary-foreground"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Task
        </Button>
        <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <FilterTasksDialog open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  )
}
