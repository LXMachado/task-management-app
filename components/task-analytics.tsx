"use client"

import { useMemo } from "react"
import { addDays, startOfDay } from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  AlarmClockOff,
  CalendarClock,
  CheckCircle2,
  ListChecks,
} from "lucide-react"

import { useTaskStore } from "@/lib/store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

const UPCOMING_WINDOW_DAYS = 7

export function TaskAnalytics() {
  const { tasks } = useTaskStore()

  const analytics = useMemo(() => {
    const statusCounts = {
      todo: 0,
      inProgress: 0,
      done: 0,
    }

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
    }

    let overdue = 0
    let dueSoon = 0

    const today = startOfDay(new Date())
    const upcomingThreshold = addDays(today, UPCOMING_WINDOW_DAYS)

    for (const task of tasks) {
      statusCounts[task.status] += 1
      priorityCounts[task.priority] += 1

      if (task.dueDate) {
        const dueDate = new Date(task.dueDate)
        if (!Number.isNaN(dueDate.getTime()) && task.status !== "done") {
          if (dueDate < today) {
            overdue += 1
          } else if (dueDate <= upcomingThreshold) {
            dueSoon += 1
          }
        }
      }
    }

    const totalTasks = tasks.length
    const completedTasks = statusCounts.done
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      completionRate,
      overdue,
      dueSoon,
      statusCounts,
      priorityCounts,
    }
  }, [tasks])

  const statusChartData = [
    { status: "todo", label: "To Do", value: analytics.statusCounts.todo },
    { status: "inProgress", label: "In Progress", value: analytics.statusCounts.inProgress },
    { status: "done", label: "Done", value: analytics.statusCounts.done },
  ]

  const statusChartConfig = {
    todo: {
      label: "To Do",
      color: "hsl(var(--chart-1))",
    },
    inProgress: {
      label: "In Progress",
      color: "hsl(var(--chart-2))",
    },
    done: {
      label: "Done",
      color: "hsl(var(--chart-3))",
    },
  } as const

  const priorityChartData = [
    { priority: "high", label: "High", value: analytics.priorityCounts.high },
    { priority: "medium", label: "Medium", value: analytics.priorityCounts.medium },
    { priority: "low", label: "Low", value: analytics.priorityCounts.low },
  ]

  const priorityChartConfig = {
    high: {
      label: "High",
      color: "hsl(var(--chart-3))",
    },
    medium: {
      label: "Medium",
      color: "hsl(var(--chart-4))",
    },
    low: {
      label: "Low",
      color: "hsl(var(--chart-5))",
    },
  } as const

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Across every project and status.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">{analytics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedTasks} of {analytics.totalTasks || 0} tasks finished.
            </p>
            <Progress value={analytics.completionRate} />
            <p className="text-xs text-muted-foreground">{analytics.completionRate}% completion rate.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlarmClockOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due and still open.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.dueSoon}</div>
            <p className="text-xs text-muted-foreground">
              Due within {UPCOMING_WINDOW_DAYS} days and not yet done.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium">Tasks by Status</CardTitle>
            <CardDescription>Track how work is distributed across the board.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={statusChartConfig} className="h-[260px]">
              <BarChart data={statusChartData}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <ChartTooltip cursor={{ fill: "hsl(var(--secondary) / 0.3)" }} content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusChartData.map((item) => (
                    <Cell key={item.status} fill={`var(--color-${item.status})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium">Tasks by Priority</CardTitle>
            <CardDescription>Gauge where attention is needed most.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={priorityChartConfig} className="mx-auto h-[260px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <ChartLegend
                  verticalAlign="bottom"
                  content={<ChartLegendContent className="flex-wrap gap-3" hideIcon />}
                />
                <Pie
                  data={priorityChartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  stroke="transparent"
                  paddingAngle={2}
                >
                  {priorityChartData.map((item) => (
                    <Cell key={item.priority} fill={`var(--color-${item.priority})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
