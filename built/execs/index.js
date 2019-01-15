"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("./helpers"));
const postgres_1 = __importDefault(require("./postgres"));
const teardown_1 = __importDefault(require("./teardown"));
class DockestExecs {
    constructor() {
        this.postgres = postgres_1.default();
        this.teardown = teardown_1.default();
        this.helpers = helpers_1.default();
    }
}
exports.DockestExecs = DockestExecs;
exports.default = DockestExecs;
