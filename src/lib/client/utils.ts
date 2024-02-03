export function handleFetchError(error: any) {
  console.error(error);
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function formatTime(date: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));

  return formattedDate;
}

export function formatDate(date: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));

  return formattedDate;
}

export function formatMonthAndDay(date: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

  return formattedDate;
}

export function formatMonthShort(date: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(new Date(date));

  return formattedDate;
}

export function formatDayNumeric(date: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
  }).format(new Date(date));

  return formattedDate;
}

export function formatWeekdayLong(date: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(new Date(date));

  return formattedDate;
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

export function formatPrice(price: string) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(price));
  return formatted;
}
