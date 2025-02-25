import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { Request, Response } from 'express'
import StudentController from '../controllers/Student'
import prisma from '../lib/prisma'
import { cleanDatabase } from '../../prisma/seed'

describe('StudentController', () => {
  beforeAll(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await cleanDatabase()
    await prisma.$disconnect()
  })

  const MOCK_STUDENT = {
    email: 'test@example.com',
    academic_registration: '123456',
    name: 'John Doe',
    identification: "TEST123456789"
  }

  
  describe('create', () => {
    it('should create a new user with profile successfully', async () => {
      const mockRequest = {
        body: MOCK_STUDENT,
        user: {
          role: 'admin'
        }
      } as Request

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response

      await StudentController.create(mockRequest, mockRes)
      expect(mockRes.status).toHaveBeenCalledWith(201)

      const createdUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
        include: { profile: true }
      })

      expect(createdUser).toBeTruthy()
      expect(createdUser?.email).toBe('test@example.com')
      expect(createdUser?.role).toBe('student')
      expect(createdUser?.profile?.name).toBe('John Doe')
      expect(createdUser?.profile?.academic_registration).toBe('123456')

      expect(createdUser?.profile).toBeTruthy()
    })

    describe('When user does not have permission', () => {
      it("should return 403", async () => {
        const mockRequest = {
          body: MOCK_STUDENT,
          user: {
            role: 'student'
          }
        } as Request
        const mockRes = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as unknown as Response
        await StudentController.create(mockRequest, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(403)
      })
    })
  })

  describe('listAll', () => {
    it('should return all students', async () => {
      const mockRequest = {
        user: {
          role: 'admin'
        }
      } as Request
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response
      await StudentController.listAll(mockRequest, mockRes)
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
    
  })
})