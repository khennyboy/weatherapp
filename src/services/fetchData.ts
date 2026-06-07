
import type { Resource } from "../utils/types"


const cache: Record<string, Resource<unknown>> = {}

export function fetchData<T>(url: string): Resource<T> {

  // If this URL has never been fetched before, start the fetch
  if (!cache[url]) {

    // Track the status of this fetch
    let status: 'pending' | 'success' | 'error' = 'pending'
    let result: T | Error

    const promise = fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`)
        }
        return res.json() as Promise<T>
      })
      .then((data: T) => {
        return new Promise<T>((resolve) => {
          setTimeout(() => resolve(data), 3000)
        })
      })

      .then((data: T) => {
        status = 'success'
        result = data
      })
      .catch((error: Error) => {
        status = 'error'
        result = error
      })

    // Store a resource object in the cache for this URL
    cache[url] = {
      read(): T {
        if (status === 'pending') {
          throw promise
        }

        if (status === 'error') {
          throw result
        }
        return result as T
      }
    }
  }

  // Return the cached resource (typed as Resource<T>)
  return cache[url] as Resource<T>
}

// Call this to force a fresh fetch next time (clears the cache for a URL)
export function clearCache(url: string): void {
  delete cache[url]
}
