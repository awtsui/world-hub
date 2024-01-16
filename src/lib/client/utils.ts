export function handleFetchError(error: any) {
  console.error(error);
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  return formattedDate;
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}
