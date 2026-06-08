import type { Resource } from "../utils/types"

export function fetchData<T>(url: string): Resource<T> {

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

  const response = {
    read(): T {
      if (status === 'pending') throw promise
      if (status === 'error') throw result
      return result as T
    }
  }

  return response as Resource<T>
}