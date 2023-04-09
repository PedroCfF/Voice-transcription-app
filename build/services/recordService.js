"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_microphone_1 = __importDefault(require("node-microphone"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
let isRecording = false;
let isBeingNamed = false;
let mic;
let micStream;
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const startRecording = () => {
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
    // Create a temporary file to store the audio data
    const tempFile = fs_1.default.createWriteStream('temp_audio_data', { encoding: 'binary' });
    // Set up the events
    micStream.on('data', (data) => {
        console.log('Received data:', data);
        tempFile.write(data);
    });
    micStream.on('error', (error) => {
        console.error('Error:', error);
    });
};
const stopRecording = () => {
    console.log('Recording stopped.');
    mic.stopRecording();
    isRecording = false;
    if (micStream) {
        isBeingNamed = true;
        rl.question('Enter a filename for the audio file: ', (filename) => {
            if (!filename.endsWith('.wav')) {
                filename += '.wav';
            }
            const folderPath = 'audioFiles/';
            filename = folderPath + filename;
            // Read the temporary file
            const tempData = fs_1.default.readFileSync('temp_audio_data', { encoding: 'binary' });
            // Write the temporary data to the new file
            fs_1.default.writeFileSync(filename, tempData, { encoding: 'binary' });
            console.log(`Audio file saved as ${filename}`);
            // Delete the temporary file
            fs_1.default.unlinkSync('temp_audio_data');
            rl.close();
            micStream.end();
            isBeingNamed = false;
        });
    }
};
const getIsRecording = () => {
    return isRecording;
};
const getIsBeingNamed = () => {
    return isBeingNamed;
};
exports.default = {
    startRecording,
    stopRecording,
    getIsRecording,
    getIsBeingNamed
};
