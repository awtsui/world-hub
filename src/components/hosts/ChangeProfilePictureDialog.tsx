import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { HostProfile } from '@/lib/types';
import UploadPictureButton from './UploadPictureButton';

interface ChangeProfilePictureDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  hostProfile: HostProfile;
}

export default function ChangeProfilePictureDialog({
  isDialogOpen,
  setIsDialogOpen,
  hostProfile,
}: ChangeProfilePictureDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[200px]">
        <DialogHeader className="items-center">
          <DialogTitle>Choose a new profile picture</DialogTitle>
        </DialogHeader>
        <UploadPictureButton hostProfile={hostProfile} />
      </DialogContent>
    </Dialog>
  );
}
