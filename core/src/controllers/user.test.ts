import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { Request, Response } from 'express'
import UserController from './User'
import prisma from '../lib/prisma'
import { cleanDatabase } from '../../prisma/seed'
import { hashedPassword } from '../services/hashedPassword'

  const MOCK_STUDENT = {
    email: 'test@example.com',
    academic_registration: '123456',
    name: 'John Doe',
    identification: "TEST123456789"
  }

describe('UserController', () => {
  beforeAll(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await cleanDatabase()
    await prisma.$disconnect()
  })

  describe('create', () => {
    it('should create a new user with profile successfully', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        },
        user: {
          role: 'admin'
        }
      } as Request

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response

      await UserController.create(mockRequest, mockRes)
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'POST request successful',
          body: expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com',
              role: 'admin'
            }),
            profile: expect.objectContaining({
              userId: expect.any(String)
            })
          })
        })
      )

      const createdUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
        include: { profile: true }
      })

      expect(createdUser).toBeTruthy()
      expect(createdUser?.email).toBe('test@example.com')
      expect(createdUser?.role).toBe('admin')
      expect(createdUser?.profile).toBeTruthy()
    })
  })

  describe('sign-in', () => {
    it('should sign in a user successfully', async () => {
      await prisma.user.create({
        data: {
          email: 'system@admin.com',
          password: await hashedPassword('123456'),
          role: 'admin',
          profile: {
            create: {
              name: 'System Admin'
            }
          }
        }
      })
      
      const mockRequest = {
        body: {
          email: 'system@admin.com',
          password: '123456'
        }
      } as Request
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response
      await UserController.signIn(mockRequest, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          body: {
            token: expect.any(String),
            user: expect.objectContaining({})
          }
        })
      )
    })
  })

  describe('edit a user', () => {
    it('should edit a user successfully', async () => {
      const currentUser = await prisma.user.create({
        data: {
          email:'somevalid@email.com',
          password: await hashedPassword('123456'),
          role: 'admin',
        }
      })
      const mockRequest = {
        params: {
          id: currentUser.id
        },
        body: {
          email: 'memelandia@email.com',
        },
        user: {
          role: 'admin'
        }
      } as unknown as Request
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response

      await UserController.updateOne(mockRequest, mockRes)

      const updatedUser = await prisma.user.findFirst({
        where: {
          email: 'memelandia@email.com'
        }
      })

      expect(updatedUser).toBeTruthy()
      expect(updatedUser?.email).toBe('memelandia@email.com')
    })
  })

  describe('delete a user', async () => {
    let baseUser: any
    beforeAll(async () => {
      baseUser = await prisma.user.create({
        data: {
          email: MOCK_STUDENT.email+'1',
          password: await hashedPassword('123456'),
          role: 'student',
        }
      })
    })
     it('when user has permission to delete, it should be able to delete', async () => {
        const mockRequest = {
          params: {
            id: baseUser.id
          },
          user: {
            role: 'admin'
          }
        } as unknown as Request
        const mockRes = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as unknown as Response

        await UserController.deleteOne(mockRequest, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
      })
    
      it('when user does not have permission to delete, it should not be able to delete', async () => {
        const mockRequest = {
          params: {
            id: baseUser.id
          },
          user: {
            role: 'student'
          }
        } as unknown as Request
        const mockRes = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as unknown as Response
        await UserController.deleteOne(mockRequest, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(403)
      })
  })
})