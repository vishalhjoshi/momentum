"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"


interface Event {
  id: number
  name: string
  time: string
  datetime: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data: CalendarData[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  showNewEventButton?: boolean
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

export function FullScreenCalendar({ 
  data, 
  selectedDate: externalSelectedDate,
  onDateSelect,
  showNewEventButton = false 
}: FullScreenCalendarProps) {
  const today = startOfToday()
  const [internalSelectedDay, setInternalSelectedDay] = React.useState(today)
  const selectedDay = externalSelectedDate || internalSelectedDay
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())


  const handleDateSelect = (day: Date) => {
    if (onDateSelect) {
      onDateSelect(day)
    } else {
      setInternalSelectedDay(day)
    }
  }

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-muted-foreground">
                {format(today, "MMM")}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">
                {format(firstDayCurrentMonth, "MMMM, yyyy")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Button variant="outline" size="icon" className="hidden lg:flex">
            <SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to previous month"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to next month"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          {showNewEventButton && (
            <>
              <Separator orientation="vertical" className="hidden h-6 md:block" />
              <Separator
                orientation="horizontal"
                className="block w-full md:hidden"
              />

              <Button className="w-full gap-2 md:w-auto">
                <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
                <span>New Event</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
          <div className="border-r py-2.5">Sun</div>
          <div className="border-r py-2.5">Mon</div>
          <div className="border-r py-2.5">Tue</div>
          <div className="border-r py-2.5">Wed</div>
          <div className="border-r py-2.5">Thu</div>
          <div className="border-r py-2.5">Fri</div>
          <div className="py-2.5">Sat</div>
        </div>

        {/* Calendar Days */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                onClick={() => handleDateSelect(day)}
                className={cn(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "bg-accent/50 text-muted-foreground",
                  "relative flex flex-col border-b border-r hover:bg-muted focus:z-10",
                  !isEqual(day, selectedDay) && "hover:bg-accent/75",
                )}
              >
                <header className="flex items-center justify-between p-2.5">
                  <button
                    type="button"
                    className={cn(
                      isEqual(day, selectedDay) && "text-primary-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-muted-foreground",
                      isEqual(day, selectedDay) &&
                        "border-none bg-primary",
                      isEqual(day, selectedDay) &&
                        "border-none bg-primary",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-foreground",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      isToday(day) && "size-8 font-extrabold text-lg", // Increase size for today
                      !isToday(day) && "size-7 text-xs", // Normal size for others
                      "flex items-center justify-center rounded-full hover:border",
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </button>
                </header>
                <div className="flex-1 p-2.5">
                  {data
                    .filter((event) => isSameDay(event.day, day))
                    .map((dayData) => {
                      const hasEntry = dayData.events.length > 0
                      return (
                      <div key={dayData.day.toString()} className="space-y-1.5">
                        {hasEntry ? (
                          <>
                            {dayData.events.slice(0, 1).map((event) => (
                              <div
                                key={event.id}
                                className="flex flex-col items-start gap-1 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 p-2 text-xs leading-tight"
                              >
                                <p className="font-medium leading-none text-green-700 dark:text-green-300">
                                  {event.name}
                                </p>
                                <p className="leading-none text-muted-foreground">
                                  {event.time}
                                </p>
                              </div>
                            ))}
                            {dayData.events.length > 1 && (
                              <div className="text-xs text-muted-foreground">
                                + {dayData.events.length - 1} more
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground opacity-50">
                            No entry
                          </div>
                        )}
                      </div>
                      )
                    })}
                  {data.filter((event) => isSameDay(event.day, day)).length === 0 && (
                    <div className="text-xs text-muted-foreground opacity-50">
                      No entry
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
            {days.map((day, dayIdx) => {
              const hasEntry = data.some((date) => isSameDay(date.day, day))
              return (
              <button
                onClick={() => handleDateSelect(day)}
                key={dayIdx}
                type="button"
                className={cn(
                  isEqual(day, selectedDay) && "text-primary-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-muted-foreground",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "ml-auto flex items-center justify-center rounded-full",
                    isToday(day) ? "size-8 font-extrabold text-lg" : "size-6", // Larger for today
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-primary text-primary-foreground",
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "bg-primary text-primary-foreground",
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-primary/20 text-primary-700 dark:text-primary-300",
                  )}
                >
                  {format(day, "d")}
                </time>
                <div className="-mx-0.5 mt-auto flex flex-wrap-reverse justify-center">
                  {hasEntry ? (
                    <span className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                  ) : (
                    <span className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-red-300 opacity-50" />
                  )}
                </div>
              </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

