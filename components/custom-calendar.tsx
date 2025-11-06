"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns"

interface CustomCalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  datesWithTasks?: Record<string, boolean>
  className?: string
  selected?: Date
  onSelect?: (date: Date) => void
  initialFocus?: boolean
}

export function CustomCalendar({ selectedDate, onDateSelect, datesWithTasks = {}, className }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Get days in current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  // Get start of first week (including days from previous month)
  const calendarStart = startOfWeek(monthStart)
  // Get end of last week (including days from next month)
  const calendarEnd = endOfWeek(monthEnd)

  // Get all days to display
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Create week rows
  const weeks: Date[][] = []
  let week: Date[] = []

  calendarDays.forEach((day) => {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  })

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <h2 className="text-sm sm:text-base font-medium text-center flex-1 px-1">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
          aria-label="Next month"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="calendar-grid w-full">
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1 sm:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {weeks.flat().map((day, i) => {
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const hasTask = datesWithTasks[format(day, "yyyy-MM-dd")]
            const dayIsToday = isToday(day)

            return (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-full sm:h-10 lg:h-12 p-0 font-normal rounded-md text-xs sm:text-sm",
                  "min-h-[2rem] sm:min-h-[2.5rem] lg:min-h-[3rem]",
                  "touch-manipulation select-none",
                  !isCurrentMonth && "text-muted-foreground opacity-50",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  dayIsToday && !isSelected && "bg-accent text-accent-foreground",
                  hasTask && !isSelected && "font-medium underline",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                )}
                onClick={() => onDateSelect?.(day)}
                aria-label={`${format(day, "EEEE, MMMM d, yyyy")}${hasTask ? " (has tasks)" : ""}`}
              >
                <time dateTime={format(day, "yyyy-MM-dd")} className="block">
                  {format(day, "d")}
                </time>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
