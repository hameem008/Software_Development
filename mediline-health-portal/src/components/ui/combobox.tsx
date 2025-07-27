import React, { useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import classNames from "classnames";

interface ComboboxOption {
  id: number | string;
  name: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  selectedId: number | string | null;
  onChange: (id: number | string, name: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  selectedId,
  onChange,
  placeholder = "Search...",
  label,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((opt) => opt.id === selectedId);

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedOption ? selectedOption.name : "Select..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No match found.</CommandEmpty>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.name}
                  onSelect={() => {
                    onChange(opt.id, opt.name);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={classNames(
                      "mr-2 h-4 w-4",
                      selectedId === opt.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
