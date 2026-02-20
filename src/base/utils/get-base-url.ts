import { createIsomorphicFn } from '@tanstack/react-start';

let baseUrl: string | null = null;

/**
 * Extracts the base URL (protocol + host) from the current browser URL,
 * or reads the one on the server from SERVER_URL
 * @returns The base URL string (e.g., "https://api.example.com")
 */
export const getBaseUrl = createIsomorphicFn()
  .server((): string => {
    if (baseUrl !== null) {
      return baseUrl;
    }

    // Using import { env } from '~/lib/env.server'; does not seem to work here
    // @ts-expect-error we have ensured that SERVER_URL is string elsewhere
    const baseUrlRetrieved: string = process.env.SERVER_URL;
    // @ts-expect-error we have ensured that SERVER_URL is string elsewhere
    baseUrl = process.env.SERVER_URL;

    return baseUrlRetrieved;
  })
  .client((): string => {
    if (baseUrl !== null) {
      return baseUrl;
    }

    const { protocol, host } = window.location;
    const baseUrlRetrieved: string = `${protocol}//${host}`;
    baseUrl = baseUrlRetrieved;

    return baseUrlRetrieved;
  });
