"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Project, User, TaskFilters } from "@/lib/types"

interface TaskState {
  tasks: Task[]
  projects: Project[]
  users: User[]
  filters: TaskFilters

  // Task actions
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void

  // Project actions
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void

  // Filter actions
  setFilters: (filters: TaskFilters) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      projects: [],
      users: [],
      filters: {},

      // Task actions
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // Project actions
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          // Also remove project from tasks
          tasks: state.tasks.map((task) => (task.projectId === id ? { ...task, projectId: undefined } : task)),
        })),

      // Filter actions
      setFilters: (filters) => set({ filters }),
    }),
    {
      name: "task-management-storage",
    },
  ),
)

