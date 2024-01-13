export function handleFetchError(error: any) {
  console.log(error);
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
