"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
exports.default = async (serviceName) => {
    const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`;
    const containerId = await index_1.execa(cmd);
    return containerId;
};
//# sourceMappingURL=getContainerId.js.map