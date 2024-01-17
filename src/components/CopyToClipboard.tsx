'use client';

import { ReactNode } from 'react';
import { useToast } from './ui/use-toast';

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
    <div className={`${className} cursor-pointer`} onClick={onClick}>
      {children}
    </div>
  );
}
