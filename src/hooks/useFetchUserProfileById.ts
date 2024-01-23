import { fetcher } from '@/lib/client/utils';
import { UserProfile } from '@/lib/types';
import useSWR from 'swr';

export default function useFetchUserProfileById(userId?: string) {
  const { data: profile } = useSWR<UserProfile>(userId ? `/api/users/profile?id=${userId}` : '', fetcher);
  return profile;
}
