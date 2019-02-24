"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = async (execConfig) => {
    const { containerId, runnerKey } = execConfig;
    return utils_1.teardownSingle(containerId, runnerKey);
};
//# sourceMappingURL=teardown.js.map