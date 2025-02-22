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

async function factoryAdminUser () {
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

async function cleanDatabase() {
  await prisma.$transaction([
    prisma.registration.deleteMany(),
    prisma.group.deleteMany(),
    prisma.course.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ])
  console.log('Database cleaned successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })