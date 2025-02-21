import { Router, Request, Response } from 'express';
import User from '../controllers/User';

const router = Router();

router.get('/hello', async (req: Request, res: Response) => {
    await User.healthCheck(req, res);
});

router.post('/user/create', async (req: Request, res: Response) => {
    await User.create(req, res);
});

export default router;