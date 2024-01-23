import { WorldIdVerificationLevel } from '@/lib/types';
import { CheckCircle, Smartphone } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface VerificationLevelIconProps {
  verificationLevel: WorldIdVerificationLevel;
}

export default function VerificationLevelIcon({ verificationLevel }: VerificationLevelIconProps) {
  const message =
    verificationLevel === WorldIdVerificationLevel.Orb
      ? 'You are required to have a World ID created by an Orb operator to purchase a ticket.'
      : 'You are required to have the Worldcoin app to purchase a ticket.';
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer">
          {verificationLevel === WorldIdVerificationLevel.Orb ? (
            <CheckCircle color="green" className="w-8 h-8" />
          ) : (
            <Smartphone color="orange" className="w-8 h-8" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
