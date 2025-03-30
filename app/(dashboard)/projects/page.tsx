"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProjectDialog } from "@/components/project-dialog"
import { useTaskStore } from "@/lib/store"
import { format } from "date-fns"

export default function ProjectsPage() {
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<string | null>(null)
  const { projects, deleteProject } = useTaskStore()

  const handleEditProject = (id: string) => {
    setProjectToEdit(id)
  }

  const handleCloseEditDialog = () => {
    setProjectToEdit(null)
  }

  const projectBeingEdited = projectToEdit ? projects.find((p) => p.id === projectToEdit) : undefined

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projects"} total
          </p>
        </div>
        <Button onClick={() => setCreateProjectOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Button onClick={() => setCreateProjectOpen(true)}>Create your first project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{project.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteProject(project.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>Created on {format(new Date(project.createdAt), "MMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{project.description || "No description provided"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />

      {projectToEdit && (
        <ProjectDialog open={!!projectToEdit} onOpenChange={handleCloseEditDialog} projectToEdit={projectBeingEdited} />
      )}
    </div>
  )
}

