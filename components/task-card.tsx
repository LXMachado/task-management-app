"use client"

import { useState } from "react"
import { useDrag } from "react-dnd"
import { format } from "date-fns"
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useTaskStore } from "@/lib/store"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { deleteTask, projects } = useTaskStore()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const priorityClasses = {
    low: "priority-badge-low bg-green-100 text-green-800 border border-green-200",
    medium: "priority-badge-medium bg-yellow-100 text-yellow-800 border border-yellow-200",
    high: "priority-badge-high bg-red-100 text-red-800 border border-red-200",
  }

  const statusClasses = {
    todo: "status-badge-todo bg-blue-100 text-blue-800 border border-blue-200",
    inProgress: "status-badge-inProgress bg-purple-100 text-purple-800 border border-purple-200",
    done: "status-badge-done bg-green-100 text-green-800 border border-green-200",
  }

  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null

  return (
    <>
      <Card ref={drag} className={`task-card cursor-grab ${isDragging ? "opacity-50" : ""} border shadow-sm`}>
        <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
          <div className="space-y-1.5">
            <h4 className="font-medium text-sm">{task.title}</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3">
          {task.description && <p className="text-xs text-muted-foreground mb-2">{task.description}</p>}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={priorityClasses[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {project && (
              <Badge variant="outline" className="border">
                {project.name}
              </Badge>
            )}
            {task.assignedTo && (
              <Badge variant="outline" className="border">
                {task.assignedTo}
              </Badge>
            )}
          </div>
        </CardContent>
        {task.dueDate && (
          <CardFooter className="p-3 pt-0 flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d, yyyy")}
          </CardFooter>
        )}
      </Card>

      <CreateTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} taskToEdit={task} />
    </>
  )
}
