import Big from 'big.js';

export async function getEventsById(eventIds: string[]) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events/`);
    eventIds.forEach((eventId) => {
      fetchUrl.searchParams.set('id', eventId);
    });
    const resp = await fetch(fetchUrl);

    const data = await resp.json();
    return data.map((event: any) => convertEvent(event));
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export async function getEventsByCategory(categoryName: string) {
  try {
    const resp = await fetch(
      `${process.env.BASE_URL}/api/events?category=${categoryName}`,
      {
        next: { revalidate: 0 },
      }
    );
    const data = await resp.json();
    return data.map((event: any) => convertEvent(event));
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getAllEvents() {
  try {
    const resp = await fetch(`${process.env.BASE_URL}/api/events`, {
      next: { revalidate: 0 },
    });
    const data = await resp.json();
    return data.map((event: any) => convertEvent(event));
  } catch (error) {
    throw new Error(`Unable to fetch events: ${error}`);
  }
}

function convertEvent(event: any) {
  const convertedEvent = {
    ...event,
    ticketTiers: event.ticketTiers.map((tier: any) => {
      return {
        label: tier.label,
        price: new Big(tier.price),
      };
    }),
  };
  return convertedEvent;
}

export function handleFetchError(error: any) {
  console.log(error);
}
