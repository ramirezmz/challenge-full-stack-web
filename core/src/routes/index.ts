import { Router, Request, Response } from 'express';
import User from '../controllers/User';
import Student from '../controllers/Student';
import { authMiddleware } from '../middlewares/auth';
import Registration from '../controllers/Registration';
import Group from '../controllers/Group';

const router = Router();

router.get('/hello', async (req: Request, res: Response) => {
    await User.healthCheck(req, res);
});

router.post('/user/create', async (req: Request, res: Response) => {
    await User.create(req, res);
});

router.get('/user/list-all', async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
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

router.put('/user/update/:id',async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await User.updateOne(req, res);
});

router.delete('/user/:id',async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await User.deleteOne(req, res);
});

router.post('/user/:userId/group/:groupId/registration', async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await Registration.create(req, res);
});

router.get('/user/:userId/registrations', async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await Registration.listByStudent(req, res);
});

router.get('/group/list-all', async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await Group.listAll(req, res);
});

router.put('/user/:userId/group/:groupId/registration', async (req:Request, res: Response, next) => {
    await authMiddleware(req, res, next);
}, async (req: Request, res: Response) => {
    await Registration.updatedStatus(req, res);
})
export default router;