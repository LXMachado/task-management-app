"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTaskStore } from "@/lib/store"
import type { Task } from "@/lib/types"
import { format, isSameDay } from "date-fns"
import { CustomCalendar } from "@/components/custom-calendar"

export default function CalendarPage() {
  const { tasks } = useTaskStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([])

  // Update tasks when selected date changes
  useEffect(() => {
    const tasksOnDate = tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, selectedDate)
    })

    setTasksForSelectedDate(tasksOnDate)
  }, [selectedDate, tasks])

  // Function to determine which dates have tasks
  const getDatesWithTasks = () => {
    const dates: Record<string, boolean> = {}

    tasks.forEach((task) => {
      if (task.dueDate) {
        const date = new Date(task.dueDate)
        const dateString = format(date, "yyyy-MM-dd")
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              datesWithTasks={datesWithTasks}
              className="mx-auto"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col space-y-1.5 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-4 sm:py-6">
                <p className="text-muted-foreground">No tasks for this date</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 sm:p-4 border rounded-lg flex flex-col justify-between items-start gap-2"
                  >
                    <div className="w-full">
                      <h3 className="font-medium text-sm sm:text-base">{task.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
                        {task.description || "No description"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 w-full">
                      <div
                        className={`
                          px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium
                          ${task.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""}
                          ${task.priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : ""}
                          ${task.priority === "low" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
                        `}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </div>
                      <div
                        className={`
                          px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium
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
