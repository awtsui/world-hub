'use client';

import { AlertStatus } from '@/types';
import { useAlert } from '../context/AlertContext';
import { Button } from './Button';

export default function Alert() {
  const { alert, alertText, clear } = useAlert();

  if (alert !== AlertStatus.None) {
    return (
      <div className="fixed top-10 left-0 w-full h-full flex flex-col items-center justify-start py-10">
        <div className="flex flex-col bg-white p-4 rounded shadow-md">
          {alertText}
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
