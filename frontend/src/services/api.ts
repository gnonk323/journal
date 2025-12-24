import axios from "axios"

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY as string,
  }
})