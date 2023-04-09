import express, { Request, Response } from 'express';
import fs from 'fs';
import Microphone from 'node-microphone';
const readline = require('readline');

let isRecording = false;
let mic: Microphone;
let micStream: any;

const app = express();
const port = 3000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

app.get("/", (_req: Request, _res: Response) => {
  console.log('Press "r" to start recording, press "ctrl+c" to exit.');
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (_str, key) => {
    if (key.name === 'r' && !isRecording) {
      startRecording();
    } else if (key.name === 's' && isRecording) {
      stopRecording();
    }

    if (key.ctrl && key.name === 'c') {
      if (isRecording) {
        stopRecording();
      }
      process.exit();
    }
  });

})

function startRecording() {
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
  const outputFile = fs.createWriteStream('output.wav', { encoding: 'binary' });

  micStream.on('data', (data: any) => {
    outputFile.write(data);
  });

  micStream.on('error', (error: any) => {
    console.error('Error:', error);
  });
}

function stopRecording() {
  console.log('Recording stopped.');
  isRecording = false;
  mic.stopRecording();

  if (micStream) {
    rl.question('Enter a filename for the audio file: ', (filename: any) => {
      if (!filename.endsWith('.wav')) {
        filename += '.wav';
      }
      const outputFile = fs.createWriteStream(filename, { encoding: 'binary' });

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
        process.exit();
      });

      micStream.end();
    });
  }
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
