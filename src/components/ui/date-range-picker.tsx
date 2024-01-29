'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({ dateRange, setDateRange }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button id="date" variant={'ghost'} className="flex flex-col items-start h-full w-[300px]">
          <p className=" text-sm">Date</p>
          <>
            {dateRange?.from ? (
              dateRange.to ? (
                <p className="text-slate-500">
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </p>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <p className="text-slate-500">Pick a date</p>
            )}
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
