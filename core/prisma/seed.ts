import { PrismaClient } from '@prisma/client'
import { hashedPassword } from '../src/services/hashedPassword'

const prisma = new PrismaClient()

async function main() {
  await cleanDatabase()
  const today = new Date()
  const oneMonthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const twoMonthsFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
  const fourMonthsFromNow = new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000)
  const courses = [
    {
      name: 'Introduction to Programming',
      description: 'Learn the basics of programming with Python and JavaScript',
    },
    {
      name: 'Web Development Fundamentals',
      description: 'HTML, CSS, and JavaScript for beginners',
    },
    {
      name: 'Database Design',
      description: 'Learn SQL and database modeling',
    },
    {
      name: 'Advanced JavaScript',
      description: 'Deep dive into modern JavaScript and frameworks',
    },
    {
      name: 'Mobile App Development',
      description: 'Build mobile apps with React Native',
    },
    {
      name: 'Cloud Computing',
      description: 'AWS, Azure, and Google Cloud fundamentals',
    },
    {
      name: 'Data Structures and Algorithms',
      description: 'Essential computer science concepts',
    },
    {
      name: 'Machine Learning Basics',
      description: 'Introduction to AI and ML concepts',
    },
    {
      name: 'Cybersecurity Fundamentals',
      description: 'Basic security concepts and practices',
    },
    {
      name: 'DevOps Engineering',
      description: 'CI/CD, Docker, and Kubernetes',
    }
  ]
  const admin = await factoryAdminUser()

  const createdCourses = await Promise.all(
    courses.map(course => prisma.course.create({ data: course }))
  )

  await createStudents(admin.id)


for (const course of createdCourses) {
  const timestamp = Date.now()
  await Promise.all([
    prisma.group.create({
      data: {
        courseId: course.id,
        code: `${course.name.substring(0, 3)}-${timestamp}-001`.toUpperCase(),
        startDate: today,
        endDate: twoMonthsFromNow,
          createdById: admin.id,
          updatedById: admin.id
      }
    }),
    prisma.group.create({
      data: {
        courseId: course.id,
        code: `${course.name.substring(0, 3)}-${timestamp}-002`.toUpperCase(),
        startDate: oneMonthFromNow,
        endDate: fourMonthsFromNow,
        createdById: admin.id,
        updatedById: admin.id
      }
    })
  ])
}

  console.log('Seed completed successfully')
}

export async function factoryAdminUser () {
  const adminPassword = await hashedPassword('123456')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      profile: {
        create: {
          name: 'Admin User'
        }
      }
    }
  })
  return admin
}

export async function cleanDatabase() {
 try {
   await prisma.$transaction([
    prisma.registration.deleteMany(),
    prisma.group.deleteMany(),
    prisma.course.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ])
  console.log('Database cleaned successfully')
 } catch (error) {
  console.log('Error cleaning database:', error)
  throw error
 }
}

async function createStudents(createdBy: string) {
  const students = Array.from({ length: 20 }, (_, index) => ({
    email: `student${index + 1}@example.com`,
    password: '123456',
    name: `Student ${index + 1}`,
    academic_registration: `2024${String(index + 1).padStart(4, '0')}`,
    identification: `ID${String(index + 1).padStart(5, '0')}`
  }))

  const createdStudents = await Promise.all(
    students.map(async student => {
      const hashedPass = await hashedPassword(student.password)
      return prisma.user.create({
        data: {
          email: student.email,
          password: hashedPass,
          role: 'student',
          createdById: createdBy,
          updatedById: createdBy,
          profile: {
            create: {
              name: student.name,
              academic_registration: student.academic_registration,
              identification: student.identification
            }
          }
        }
      })
    })
  )

  console.log('Students created successfully')
  return createdStudents
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })