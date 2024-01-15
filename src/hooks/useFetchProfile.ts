'use client';

import { handleFetchError } from '@/lib/client/utils';
import { UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react';

interface useFetchProfileParams {
  userId?: string;
}

export default function useFetchProfile({ userId }: useFetchProfileParams) {
  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/profile?id=${userId}`)
        .then((resp) => resp.json())
        .then((data) => setProfile(data))
        .catch((error) => handleFetchError(error));
    }
  }, [userId]);

  return { profile };
}
