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

interface Course {
  id: string
  name: string
  description: string
  createdAt: Date
}

interface Registration {
  id: string
  studentId: string
  groupId: string
  registrationAt: Date
  status: string
  student: Profile
}

export interface Group {
  id: string
  courseId: string
  code: string
  startDate?: Date
  endDate?: Date
  createdAt: Date
  createdById: string
  updatedAt?: Date
  updatedById?: string
  course: Course
  registrations?: Registration[]
}

export interface GroupResponse {
  message: string
  body: Group[]
}