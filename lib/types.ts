export type TaskStatus = "todo" | "inProgress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
  projectId?: string
  assignedTo?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  projectId?: string
  assignedTo?: string
}

