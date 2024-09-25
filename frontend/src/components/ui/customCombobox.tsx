'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from './scroll-area';

export type ComboboxOptions = {
  value: string;
  label: string;
};

type Mode = 'single' | 'multiple';

interface ComboboxProps {
  mode?: Mode;
  options: ComboboxOptions[];
  selected: string | string[]; // Updated to handle multiple selections
  className?: string;
  placeholder?: string;
  onChange?: (event: string | string[]) => void; // Updated to handle multiple selections
  onCreate?: (value: string) => void;
}

export function CustomCombobox({
                                 options,
                                 selected,
                                 className,
                                 placeholder,
                                 mode = 'single',
                                 onChange,
                                 onCreate,
                               }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>('');

  return (
    <div className={cn('block', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            key={'combobox-trigger'}
            type='button'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {selected && selected.length > 0 ? (
              <div className='relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden'>
                <span>
                  {mode === 'multiple' && Array.isArray(selected)
                    ? selected
                      .map(
                        (selectedValue: string) =>
                          options.find((item) => item.value === selectedValue)
                            ?.label
                      )
                      .join(', ')
                    : mode === 'single' &&
                    options.find((item) => item.value === selected)?.label}
                </span>
              </div>
            ) : (
              placeholder ?? 'Select Item...'
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-72 max-w-sm p-0'>
          <Command
            filter={(value, search) => {
              if (value.toLowerCase().includes(search.toLowerCase())) return 1;
              return 0;
            }}
            // shouldFilter={true}
          >
            <CommandInput
              placeholder={placeholder ?? 'Cari Item...'}
              value={query}
              onValueChange={(value: string) => setQuery(value)}
            />
            <ScrollArea>
              <div className='max-h-80'>
                <CommandGroup>
                  <CommandList>
                    {options.map((option) => (
                      <CommandItem
                        key={option.label}
                        value={option.label}
                        onSelect={(currentValue) => {
                          if (onChange) {
                            if (mode === 'multiple' && Array.isArray(selected)) {
                              onChange(
                                selected.includes(option.value)
                                  ? selected.filter(
                                    (item) => item !== option.value
                                  )
                                  : [...selected, option.value]
                              );
                            } else {
                              onChange(option.value);
                            }
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selected.includes(option.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                    {(query && !options.map(x => x.value).includes(query)) && <CommandItem className="px-8" onSelect={() => {
                      if (onCreate) {
                        onCreate(query)
                        setQuery('')
                      }
                    }}

                    >
                        Create {query}
                    </CommandItem>}
                  </CommandList>
                </CommandGroup>
              </div>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}