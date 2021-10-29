import KoaRouter from 'koa-router';
import { UserKoaController } from '../controllers/user';

const userController = new UserKoaController();

const apiRouter = new KoaRouter({ prefix: '/api' });
apiRouter.post('/user', userController.create);
apiRouter.get('/user', userController.read);
apiRouter.get('/user/:userId', userController.readById);
apiRouter.patch('/user/:userId', userController.update);
apiRouter.delete('/user/:userId', userController.delete);

apiRouter.post('/auth');
export default apiRouter;
