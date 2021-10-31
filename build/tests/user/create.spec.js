"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const set_up_1 = require("../set-up");
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
describe('Create-User', function () {
    before(async function (_done) {
        const testApp = await set_up_1.setup.start();
        this.adminToken = testApp === null || testApp === void 0 ? void 0 : testApp.adminToken;
        this.userToken = testApp === null || testApp === void 0 ? void 0 : testApp.userToken;
        this.app = set_up_1.server;
        this.url = `http://localhost:8000/api`;
    });
    after(async function (_done) {
        await set_up_1.setup.stop();
    });
    it('Admins should be able to create user', function (done) {
        chai_1.default
            .request(set_up_1.server)
            .get(`/api/user/`)
            .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.data.length.should.eql(2);
            res.body.data[0].should.include.keys('id', 'title', 'body', 'tags');
            done();
        });
    });
});
//# sourceMappingURL=create.spec.js.map