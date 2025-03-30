"use client"

import { useDrop } from "react-dnd"
import { TaskCard } from "@/components/task-card"
import { useTaskStore } from "@/lib/store"
import type { Task, TaskStatus } from "@/lib/types"

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  status: TaskStatus
}

export function KanbanColumn({ title, tasks, status }: KanbanColumnProps) {
  const { updateTask } = useTaskStore()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => {
      const task = tasks.find((t) => t.id === item.id)
      if (task && task.status !== status) {
        updateTask({
          ...task,
          status,
          updatedAt: new Date().toISOString(),
        })
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`bg-kanban text-kanban-foreground rounded-lg p-4 ${
        isOver ? "ring-2 ring-primary/50" : ""
      } transition-colors`}
      data-status={status}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="bg-background/50 text-foreground text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm italic border border-dashed rounded-md">
            No tasks
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}

