"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const user_1 = require("../controllers/user");
const auth_1 = require("./auth");
const userController = new user_1.UserKoaController();
const authController = new auth_1.AuthenticatonController();
const apiRouter = new koa_router_1.default({ prefix: '/api' });
apiRouter.post('/user', userController.create);
apiRouter.get('/user', authController.protect, authController.admin, userController.read);
apiRouter.get('/user/:userId', userController.readById);
apiRouter.patch('/user/:userId', authController.protect, authController.admin, userController.update);
apiRouter.delete('/user/:userId', authController.protect, authController.admin, userController.delete);
apiRouter.delete('/user/', authController.protect, authController.admin, userController.deleteMany);
apiRouter.get('/debug/', userController.read);
apiRouter.post('/auth', authController.signIn);
exports.default = apiRouter;
//# sourceMappingURL=routes.js.map