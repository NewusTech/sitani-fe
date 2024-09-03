"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Framework {
  value: string
  label: string
}

interface ComboboxProps {
  options: Framework[]
  placeholder?: string
  buttonLabel?: string
  onSelect: (value: string) => void
}

function InputSearch({ options, placeholder = "Search...", buttonLabel = "Select an option...", onSelect }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex h-10 justify-between w-full rounded-full border border-primary bg-white px-4 py-5 text-md ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500"
        >
          {value ? options.find((option) => option.value === value)?.label : buttonLabel}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const selectedValue = currentValue === value ? "" : currentValue
                    setValue(selectedValue)
                    onSelect(selectedValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn("ml-auto h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default InputSearch
