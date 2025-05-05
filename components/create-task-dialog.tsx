"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomCalendar as Calendar } from "@/components/custom-calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTaskStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Task, TaskStatus, TaskPriority } from "@/lib/types"
import { Label } from "@/components/ui/label"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskToEdit?: Task
}

export function CreateTaskDialog({ open, onOpenChange, taskToEdit }: CreateTaskDialogProps) {
  const { addTask, updateTask, projects } = useTaskStore()
  const isEditing = !!taskToEdit

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<TaskStatus>("todo")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [assignedTo, setAssignedTo] = useState("")

  // Initialize form with task data if editing
  useEffect(() => {
    if (isEditing && taskToEdit) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description || "")
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined)
      setStatus(taskToEdit.status)
      setPriority(taskToEdit.priority)
      setProjectId(taskToEdit.projectId)
      setAssignedTo(taskToEdit.assignedTo || "")
    } else {
      // Reset form for new task
      setTitle("")
      setDescription("")
      setDueDate(undefined)
      setStatus("todo")
      setPriority("medium")
      setProjectId(undefined)
      setAssignedTo("")
    }
  }, [isEditing, taskToEdit, open])

  // Form validation
  const [titleError, setTitleError] = useState("")

  const validateForm = () => {
    let isValid = true

    if (!title.trim()) {
      setTitleError("Title is required")
      isValid = false
    } else {
      setTitleError("")
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const taskData = {
        title,
        description: description || undefined,
        dueDate: dueDate?.toISOString(),
        status,
        priority,
        projectId: projectId === "none" ? undefined : projectId,
        assignedTo: assignedTo || undefined,
      }

      if (isEditing && taskToEdit) {
        updateTask({
          ...taskToEdit,
          ...taskData,
          updatedAt: new Date().toISOString(),
        })
      } else {
        addTask({
          id: crypto.randomUUID(),
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting task:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your task below."
              : "Add a new task to your board. Fill out the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            {titleError && <p className="text-sm text-red-500">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task"
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={projectId || "none"}
                onValueChange={(value) => setProjectId(value === "none" ? undefined : value)}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assignee</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Assignee"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Task" : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
