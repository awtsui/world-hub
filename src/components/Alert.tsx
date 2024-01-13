'use client';

import { AlertStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useAlertDialog } from '@/context/ModalContext';

export default function AlertPopup() {
  const { alert, alertText, clear } = useAlertDialog();

  return (
    <AlertDialog onOpenChange={clear} open={alert !== AlertStatus.None}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {alertText}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogAction asChild className="items-center">
          <Button onClick={clear}>Okay</Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
