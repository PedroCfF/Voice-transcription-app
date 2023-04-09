"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recordService_1 = __importDefault(require("../services/recordService"));
const readline_1 = __importDefault(require("readline"));
const handleKeypress = () => {
    readline_1.default.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (_str, key) => {
        if (key.name === 'r' && !recordService_1.default.getIsRecording()) {
            recordService_1.default.startRecording();
        }
        if (key.name === 's' && recordService_1.default.getIsRecording()) {
            recordService_1.default.stopRecording();
        }
        if (key.ctrl && key.name === 'c') {
            if (recordService_1.default.getIsRecording()) {
                recordService_1.default.stopRecording();
            }
            process.exit();
        }
    });
};
exports.default = {
    handleKeypress,
};
