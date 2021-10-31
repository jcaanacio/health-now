"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserKoaController = void 0;
const user_1 = require("../services/user");
const service = new user_1.UserService();
class UserKoaController {
    async create(ctx, _next) {
        const { email, username, password, firstname, lastname, address, phone, postcode, role, } = ctx.request.body;
        const user = await service.create({
            email,
            username,
            password,
            firstname,
            lastname,
            address,
            postcode,
            phone,
            role,
        });
        ctx.body = {
            user: user,
        };
        ctx.status = 201;
    }
    async read(ctx, _next) {
        const users = await service.reads();
        ctx.body = {
            user: users,
        };
        ctx.status = 200;
    }
    async readById(ctx, _next) {
        const { userId } = ctx.params;
        const user = await service.read(userId);
        ctx.body = {
            user: user,
        };
        ctx.status = 200;
    }
    async update(ctx, _next) {
        const { userId } = ctx.params;
        const { email, username, password, firstname, lastname, address, phone, postcode, role, } = ctx.request.body;
        const user = await service.update(userId, {
            email,
            username,
            password,
            firstname,
            lastname,
            address,
            postcode,
            phone,
            role,
        });
        ctx.body = {
            user: user,
        };
        ctx.status = 200;
    }
    async delete(ctx, _next) {
        const { userId } = ctx.params;
        const user = await service.delete(userId);
        ctx.body = {
            user: user,
        };
        ctx.status = 200;
    }
    async deleteMany(ctx, _next) {
        const { userIds } = ctx.request.body;
        const user = await service.deleteMany(userIds);
        ctx.body = {
            user: user,
        };
        ctx.status = 200;
    }
}
exports.UserKoaController = UserKoaController;
//# sourceMappingURL=user.js.map