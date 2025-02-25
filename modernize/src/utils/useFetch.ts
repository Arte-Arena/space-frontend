import { useState } from 'react';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

interface FetchOptions extends Omit<RequestInit, 'method'> {
  accessToken?: string;
  method?: HttpMethod;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: (url: string, options?: FetchOptions) => Promise<void>;
}

export function useFetch<T>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (url: string, options?: FetchOptions) => {
    try {
      setLoading(true);
      setError(null);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options?.accessToken && {
          Authorization: `Bearer ${options.accessToken}`,
        }),
        ...options?.headers,
      };

      const response = await fetch(url, {
        method: options?.method || HttpMethod.GET,
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}