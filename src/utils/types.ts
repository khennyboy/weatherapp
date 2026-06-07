// This file defines all the TypeScript types used across the app

export interface User {
  id: number
  name: string
  role: string
  email: string
  departmentId: number
}

export interface Department {
  id: number
  name: string
}


export interface Resource<T> {
  read: () => T
}
