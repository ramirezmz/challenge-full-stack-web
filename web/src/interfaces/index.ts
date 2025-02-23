export interface Profile {
  id: string
  userId: string
  name: string | null
  academic_registration: string | null
  identification: string | null
}

export interface User {
  id: string
  email: string
  role: 'student' | 'admin'
  profile: Profile | null
  createdAt: string
  updatedAt: string
}

export interface ListAllUsersResponse {
  message: string
  body: User[]
}

export interface createStudentSchema {
  email: string
  name: string
  academic_registration?: string
  identification?: string
}