import { Router, Request, Response } from 'express';
import User from '../controllers/User';
import Student from '../controllers/Student';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/hello', async (req: Request, res: Response) => {
    await User.healthCheck(req, res);
});

router.post('/user/create', async (req: Request, res: Response) => {
    await User.create(req, res);
});

router.get('/user/list-all', async (req: Request, res: Response) => {
    await User.listAll(req, res);
});

router.post('/user/sign-in', async (req: Request, res: Response) => {
    await User.signIn(req, res);
});

router.post('/student/create', async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await Student.create(req, res);
});

router.get('/student/list-all',async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await Student.listAll(req, res);
});

export default router;