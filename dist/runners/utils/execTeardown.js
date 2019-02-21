"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
exports.default = async (execConfig) => {
    const { containerId, runnerKey } = execConfig;
    return index_1.teardownSingle(containerId, runnerKey);
};
//# sourceMappingURL=execTeardown.js.map