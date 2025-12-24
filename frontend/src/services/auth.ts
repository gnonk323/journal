import api from "../lib/api"

export async function loginService(password: string) {
  const response = await api.post("/api/auth/login", { password })
  return response
}

export async function logoutService() {
  const response = await api.post("/api/auth/logout")
  return response
}

export async function checkAuth() {
  try {
    await api.get("/api/auth/check")
    return true
  } catch (error) {
    return false
  }
}