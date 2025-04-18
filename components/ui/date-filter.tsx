"use client"
import { useState } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DateFilterProps {
  date?: Date
  onDateChange: (date?: Date) => void
  className?: string
}

export function DateFilter({ date, onDateChange, className }: DateFilterProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 bg-white border-gray-200 rounded-lg flex items-center justify-between gap-2 px-3",
            className,
          )}
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-normal">{date ? format(date, "dd/MM/yy", { locale: fr }) : "Date"}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange(selectedDate)
            setOpen(false)
          }}
          initialFocus
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  )
}
