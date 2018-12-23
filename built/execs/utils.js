"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
