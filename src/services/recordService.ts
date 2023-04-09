import Microphone from 'node-microphone';
import fs from 'fs';
import readline from 'readline';
import { FileStream, ReadlineInterface } from '../types';

let isRecording: boolean = false;
let isBeingNamed: boolean = false;
let mic: Microphone;
let micStream: any;

const rl: ReadlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startRecording = (): void => {
  console.log('Recording started...');
  console.log('Press "s" to stop recording.');
  isRecording = true;

  mic = new Microphone({
    bitwidth: 16,
    channels: 1,
    device: 'default',
    rate: 16000,
  });

  micStream = mic.startRecording();
}

const stopRecording = (): void => {
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
      const outputFile: FileStream = fs.createWriteStream(filename, { encoding: 'binary' });

      micStream.on('data', (data: any) => {
        outputFile.write(data);
      });

      micStream.on('error', (error: any) => {
        console.error('Error:', error);
      });

      micStream.on('end', () => {
        console.log(`Audio file saved as ${filename}`);
        outputFile.end();
        rl.close();
      });

      micStream.end();
      isBeingNamed = false;
    });
  }
}

const getIsRecording = (): boolean => {
  return isRecording;
}

const getIsBeingNamed = (): boolean => {
  return isBeingNamed;
}

export default {
  startRecording,
  stopRecording,
  getIsRecording,
  getIsBeingNamed
};