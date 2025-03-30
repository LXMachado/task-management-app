import type { Metadata } from "next"
import { KanbanBoard } from "@/components/kanban-board"
import { TaskHeader } from "@/components/task-header"

export const metadata: Metadata = {
  title: "Task Management App",
  description: "A comprehensive task management application with Google Calendar integration",
}

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <TaskHeader />
      <KanbanBoard />
    </main>
  )
}

