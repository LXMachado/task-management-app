"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTaskStore } from "@/lib/store"
import type { Task } from "@/lib/types"
import { format } from "date-fns"

export default function CalendarPage() {
  const { tasks } = useTaskStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([])

  // Update tasks when selected date changes
  useEffect(() => {
    if (!selectedDate) return

    const tasksOnDate = tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      )
    })

    setTasksForSelectedDate(tasksOnDate)
  }, [selectedDate, tasks])

  // Function to determine which dates have tasks
  const getDatesWithTasks = () => {
    const dates: Record<string, boolean> = {}

    tasks.forEach((task) => {
      if (task.dueDate) {
        const date = new Date(task.dueDate)
        const dateString = date.toISOString().split("T")[0]
        dates[dateString] = true
      }
    })

    return dates
  }

  const datesWithTasks = getDatesWithTasks()

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage your tasks by date</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasTasks: (date) => {
                  const dateString = date.toISOString().split("T")[0]
                  return !!datesWithTasks[dateString]
                },
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  backgroundColor: "var(--primary-50)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No tasks for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasksForSelectedDate.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description || "No description"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${task.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""}
                        ${task.priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : ""}
                        ${task.priority === "low" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
                      `}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </div>
                      <div
                        className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${task.status === "todo" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : ""}
                        ${task.status === "inProgress" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" : ""}
                        ${task.status === "done" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
                      `}
                      >
                        {task.status === "todo" ? "To Do" : task.status === "inProgress" ? "In Progress" : "Done"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

