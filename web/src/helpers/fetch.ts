import api from '@/services/api'

interface LoginResponse {
  message: string
  body: {
    token: string
    user: {
      id: string
      email: string
      role: string
    }
  }
}

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<LoginResponse>('/user/sign-in', {
      email,
      password
    })
    return response.data
  }
}