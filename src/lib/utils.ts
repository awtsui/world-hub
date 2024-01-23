import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateEmailContent(data: Record<string, string>) {
  let text = '';
  let html = '<div class="p-4 bg-gray-100 rounded-md">';

  for (let [key, value] of Object.entries(data)) {
    const keyUpper = `${key[0].toUpperCase()}${key.slice(1)}`;
    text += `${keyUpper}: ${value}\n`;
    html += `<p class="mb-2"><strong class="font-semibold">${keyUpper}</strong>: ${value}</p>\n`;
  }

  html += '</div>';

  return { text, html };
}

export function isExpiredSignedUrl(url: string) {
  const urlObject = new URL(url);
  const expiresAt = urlObject.searchParams.get('Expires');
  if (!expiresAt) {
    throw Error('Url not formatted properly');
  }
  return parseInt(expiresAt) < Date.now();
}
