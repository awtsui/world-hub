'use client';

import { ReactNode } from 'react';
import { useToast } from './ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface ClipboardProps {
  text: string;
  children?: ReactNode;
  className?: string;
}

export default function CopyToClipboard({
  text,
  children,
  className,
}: ClipboardProps) {
  const { toast } = useToast();

  function onClick() {
    toast({
      title: 'Copied to clipboard',
    });
    navigator.clipboard.writeText(text);
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={`${className} cursor-pointer`}
          onClick={onClick}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
