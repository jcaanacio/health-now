"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../models/user");
class UserService {
    constructor() {
        this._repository = user_1.User;
    }
    async read(id) {
        return await this._repository.findOne(id);
    }
    async reads(input) {
        return await this._repository.find(input);
    }
    async delete(id) {
        const user = await this._repository.findOne(id);
        if (!user)
            throw new Error('Resource not found');
        return await user.remove();
    }
    async update(id, input) {
        const user = await this._repository.update(id, { ...input });
        return user.raw;
    }
    async create(input) {
        return await this._repository.create(input).save();
    }
    async deleteMany(ids) {
        const users = await this._repository.findByIds(ids);
        users.map(async (user) => {
            await user.remove();
            await user.save();
        });
        return users;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.js.map