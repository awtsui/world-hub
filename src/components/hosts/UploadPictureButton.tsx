'use client';
import { ChangeEvent, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, X } from 'lucide-react';
import { HostProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { useAlertDialog } from '@/context/ModalContext';

interface UploadPictureButtonProps {
  hostProfile: HostProfile;
}

export default function UploadPictureButton({
  hostProfile,
}: UploadPictureButtonProps) {
  // TODO: update ref type
  const hiddenFileInput = useRef<any>();
  const [picturePreview, setPicturePreview] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const { data: session } = useSession();
  const { setSuccess, setError } = useAlertDialog();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (picturePreview) {
        URL.revokeObjectURL(picturePreview);
      }
      const url = URL.createObjectURL(file);
      setPicturePreview(url);
      setImageFile(file);
    }
  }

  function handleImportClick() {
    hiddenFileInput.current.click();
  }

  function closePreview() {
    setPicturePreview(undefined);
    setImageFile(undefined);
  }

  async function handleUploadClick() {
    try {
      if (imageFile && session && session.user) {
        const presignedUrlResp = await fetch(
          `/api/upload?type=${imageFile.type}&size=${imageFile.size}&id=${session.user.id}`
        );

        if (!presignedUrlResp.ok) {
          throw Error('Failed to retrieve presigned url');
        }

        const { presignedUrl, mediaId } = await presignedUrlResp.json();

        const imageUploadResp = await fetch(presignedUrl, {
          method: 'PUT',
          body: imageFile,
          headers: { 'Content-Type': imageFile.type },
        });
        if (!imageUploadResp.ok) {
          throw Error('Thumbnail image upload failed');
        }

        const updateProfilePictureResp = await fetch('/api/hosts/profile', {
          body: JSON.stringify({
            profile: {
              mediaId,
            },
            hostId: session.user.id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!updateProfilePictureResp.ok) {
          throw Error('Failed to create event');
        }

        const revalidateHostResp = await fetch(`/api/revalidate?tag=host`);
        if (!revalidateHostResp.ok) {
          throw Error('Failed to revalidate host');
        }

        setImageFile(undefined);
        setPicturePreview(undefined);
        setSuccess(`Successfully updated profile picture`, 3);
      }
    } catch (error) {
      setError('Failed to upload profile picture', 3);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Input
        type="file"
        accept="image/*"
        ref={hiddenFileInput}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      {picturePreview && (
        <div className="flex">
          <Avatar className="w-40 h-40 ml-10">
            <AvatarImage src={picturePreview} />
            <AvatarFallback>N/A</AvatarFallback>
          </Avatar>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="rounded-full"
            onClick={closePreview}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!imageFile ? (
        <Button
          className="flex items-center gap-3"
          variant={'secondary'}
          onClick={handleImportClick}
        >
          <Plus className="w-4 h-4" />
          <span>Upload photo</span>
        </Button>
      ) : (
        <Button onClick={handleUploadClick}>Confirm upload</Button>
      )}
    </div>
  );
}
