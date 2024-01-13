import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getEventsByIds(eventIds: string[]) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events`);
    eventIds.forEach((eventId) => {
      fetchUrl.searchParams.set('id', eventId);
    });
    const resp = await fetch(fetchUrl, {
      next: { tags: ['event'] },
    });
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export async function getEventsByCategory(categoryName: string) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events`);
    fetchUrl.searchParams.set('category', categoryName);
    const resp = await fetch(fetchUrl, { next: { tags: ['event'] } });
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getEventsBySubCategory(subCategoryName: string) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events`);
    fetchUrl.searchParams.set('subcategory', subCategoryName);
    const resp = await fetch(fetchUrl, {
      next: { tags: ['event'] },
    });
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getAllEvents() {
  try {
    const resp = await fetch(`${process.env.BASE_URL}/api/events`, {
      next: { tags: ['event'] },
    });
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events: ${error}`);
  }
}

export async function getHostProfileById(hostId: string) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/hosts/profile`);
    fetchUrl.searchParams.set('id', hostId);
    const resp = await fetch(fetchUrl, {
      next: { tags: ['host'] },
    });

    const data = await resp.json();
    return data;
  } catch (error) {
    throw new Error(`Unable to fetch host by id: ${error}`);
  }
}

export async function getVenueById(venueId: string) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/venues`);
    fetchUrl.searchParams.set('id', venueId);
    const resp = await fetch(fetchUrl, {
      next: { tags: ['venue'] },
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    throw new Error(`Unable to fetch host by id: ${error}`);
  }
}
