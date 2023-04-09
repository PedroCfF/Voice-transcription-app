"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordController_1 = __importDefault(require("./controllers/recordController"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/", (_req, _res) => {
    _res.send('Server is running. Use /record to start the recording process.');
});
app.get("/record", (_req, _res) => {
    recordController_1.default.handleKeypress();
    _res.send('Recording process started. Check the console for instructions.');
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
