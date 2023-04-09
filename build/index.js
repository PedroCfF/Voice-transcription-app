"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const node_microphone_1 = __importDefault(require("node-microphone"));
const readline = require('readline');
let isRecording = false;
let mic;
let micStream;
const app = (0, express_1.default)();
const port = 3000;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
app.get("/", (_req, _res) => {
    console.log('Press "r" to start recording, press "ctrl+c" to exit.');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (_str, key) => {
        if (key.name === 'r' && !isRecording) {
            startRecording();
        }
        else if (key.name === 's' && isRecording) {
            stopRecording();
        }
        if (key.ctrl && key.name === 'c') {
            if (isRecording) {
                stopRecording();
            }
            process.exit();
        }
    });
});
function startRecording() {
    console.log('Recording started...');
    console.log('Press "s" to stop recording.');
    isRecording = true;
    mic = new node_microphone_1.default({
        bitwidth: 16,
        channels: 1,
        device: 'default',
        rate: 16000,
    });
    micStream = mic.startRecording();
    const outputFile = fs_1.default.createWriteStream('output.wav', { encoding: 'binary' });
    micStream.on('data', (data) => {
        outputFile.write(data);
    });
    micStream.on('error', (error) => {
        console.error('Error:', error);
    });
}
function stopRecording() {
    console.log('Recording stopped.');
    isRecording = false;
    mic.stopRecording();
    if (micStream) {
        rl.question('Enter a filename for the audio file: ', (filename) => {
            if (!filename.endsWith('.wav')) {
                filename += '.wav';
            }
            const outputFile = fs_1.default.createWriteStream(filename, { encoding: 'binary' });
            micStream.on('data', (data) => {
                outputFile.write(data);
            });
            micStream.on('error', (error) => {
                console.error('Error:', error);
            });
            micStream.on('end', () => {
                console.log(`Audio file saved as ${filename}`);
                outputFile.end();
                rl.close();
                process.exit();
            });
            micStream.end();
        });
    }
}
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
