import Big from 'big.js';

export async function getEventsById(eventIds: string[]) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events/`);
    eventIds.forEach((eventId) => {
      fetchUrl.searchParams.set('id', eventId);
    });
    const resp = await fetch(fetchUrl);
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export async function getEventsByCategory(categoryName: string) {
  try {
    const resp = await fetch(
      `${process.env.BASE_URL}/api/events?category=${categoryName}`
    );
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getAllEvents() {
  try {
    const resp = await fetch(`${process.env.BASE_URL}/api/events`);
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events: ${error}`);
  }
}

export function handleFetchError(error: any) {
  console.log(error);
}
