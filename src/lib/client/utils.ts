export function handleFetchError(error: any) {
  console.error(error);
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
