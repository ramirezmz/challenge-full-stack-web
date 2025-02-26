import { type createStudentSchema, type ListAllUsersResponse } from '@/interfaces'
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
  },
  async listAll(query: { role?: string, search?: string }) {
    const response = await api.get<ListAllUsersResponse>('/user/list-all', { params: query })
    return response.data
  },

  async createUser(data: createStudentSchema) {
    const response = await api.post('/student/create', data)
    return response.data
  },

  async deleteUser(userId: string) {
    const response = await api.delete(`/user/${userId}`)
    return response.data
  },

  async updateStudent(id: string, data: createStudentSchema) {
    const response = await api.put(`/user/update/${id}`, data)
    return response.data
  },

  async getUser(userId: string) {
    const response = await api.get(`/user/${userId}`)
    return response.data
  }
}