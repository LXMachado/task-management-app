"use client"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { KanbanColumn } from "@/components/kanban-column"
import { useTaskStore } from "@/lib/store"

export function KanbanBoard() {
  const { tasks, filters } = useTaskStore()

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.projectId && task.projectId !== filters.projectId) return false
    return true
  })

  // Group tasks by status
  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "inProgress")
  const doneTasks = filteredTasks.filter((task) => task.status === "done")

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KanbanColumn title="To Do" tasks={todoTasks} status="todo" />
        <KanbanColumn title="In Progress" tasks={inProgressTasks} status="inProgress" />
        <KanbanColumn title="Done" tasks={doneTasks} status="done" />
      </div>
    </DndProvider>
  )
}

