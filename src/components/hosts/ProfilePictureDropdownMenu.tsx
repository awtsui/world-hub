import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Media } from '@/lib/types';

interface ProfilePictureDropdownMenuProps {
  media?: Media;
  setIsDialogOpen: (open: boolean) => void;
}

export default function ProfilePictureDropdownMenu({ media, setIsDialogOpen }: ProfilePictureDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-40 h-40 relative">
          <AvatarImage src={media ? media.url : ''} className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-500"></div>
          <AvatarFallback>N/A</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Button variant={'ghost'} onClick={() => setIsDialogOpen(true)}>
            Choose a new profile picture
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
