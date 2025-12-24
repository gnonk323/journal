import router from '../router'
import axios from "axios"

const api = axios.create({
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY as string,
  },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('isLoggedIn');
      router.push('/');
    }
    return Promise.reject(error);
  }
);

export default api