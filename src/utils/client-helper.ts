export async function getEventsByIds(eventIds: string[]) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events`);
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
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events`);
    fetchUrl.searchParams.set('category', categoryName);
    const resp = await fetch(fetchUrl);
    return await resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getEventsBySubCategory(subCategoryName: string) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/events`);
    fetchUrl.searchParams.set('subcategory', subCategoryName);
    const resp = await fetch(fetchUrl);
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

export async function getHostById(hostId: string) {
  try {
    const fetchUrl = new URL(`${process.env.BASE_URL}/api/hosts`);
    fetchUrl.searchParams.set('id', hostId);
    const resp = await fetch(fetchUrl);
    return (await resp.json())[0];
  } catch (error) {
    throw new Error(`Unable to fetch host by id: ${error}`);
  }
}
