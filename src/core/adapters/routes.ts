import KoaRouter from 'koa-router';
import { UserKoaController } from '../controllers/user';
import { AuthenticatonController } from './auth';

const userController = new UserKoaController();
const authController = new AuthenticatonController();

const apiRouter = new KoaRouter({ prefix: '/api' });
apiRouter.post('/user', userController.create);
apiRouter.get(
  '/user',
  authController.protect,
  authController.admin,
  userController.read
);
apiRouter.get('/user/:userId', userController.readById);
apiRouter.patch(
  '/user/:userId',
  authController.protect,
  authController.admin,
  userController.update
);
apiRouter.delete(
  '/user/:userId',
  authController.protect,
  authController.admin,
  userController.delete
);

apiRouter.delete(
  '/user/',
  authController.protect,
  authController.admin,
  userController.deleteMany
);

apiRouter.get('/debug/', userController.read);

apiRouter.post('/auth', authController.signIn);
export default apiRouter;
