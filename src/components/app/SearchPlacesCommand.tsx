'use client';

import usePlacesAutocomplete, { LatLng, Suggestion, getGeocode, getLatLng } from 'use-places-autocomplete';
import { Command, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchPlacesCommandProps {
  setLatLng: (result: LatLng | null) => void;
}

export default function SearchPlacesCommand({ setLatLng }: SearchPlacesCommandProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isKeywordHovered, setIsKeywordHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputDivRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: 'initAutocomplete',
    requestOptions: {
      /* Define search scope here */
      types: ['geocode'],
    },
    debounce: 300,
  });

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    }
    function handleClickInside(event: any) {
      event.preventDefault();
      if (inputDivRef.current && inputRef.current && inputDivRef.current.contains(event.target)) {
        inputRef.current.focus();
        setIsSearching(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickInside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickInside);
    };
  }, []);

  function handleSelect({ description }: Suggestion) {
    setValue(description, false);
    clearSuggestions();

    getGeocode({ address: description }).then((results) => {
      setLatLng(getLatLng(results[0]));
    });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
    setLatLng(null);
    setIsSearching(true);
  }

  return (
    <div className="h-full">
      <div
        className={cn(
          'h-full flex items-center rounded-l-full pl-3 cursor-pointer',
          isKeywordHovered ? 'bg-accent text-accent-foreground' : '',
        )}
        onMouseEnter={() => setIsKeywordHovered(true)}
        onMouseLeave={() => setIsKeywordHovered(false)}
        ref={inputDivRef}
      >
        <div className="flex flex-col items-start justify-center w-[300px]">
          <p className="text-sm ml-3">Where</p>
          <input
            type="text"
            placeholder="Search location"
            className={cn(
              'border-none w-full text-md text-slate-500 h-6 py-0 placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-0',
              isKeywordHovered ? 'bg-accent text-accent-foreground' : '',
            )}
            value={value}
            onChange={handleInputChange}
            ref={inputRef}
          />
        </div>
      </div>
      {isSearching && status === 'OK' ? (
        <div ref={dropdownRef} className="bg-white w-full py-1 mt-1 border-2 rounded-md relative z-50">
          <ol>
            {data.map((result) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = result;
              return (
                <li key={place_id}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSelect(result)}
                    className="justify-start w-full text-md h-8"
                  >
                    {`${main_text}, ${secondary_text}`}
                  </Button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
