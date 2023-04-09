import recordService from '../services/recordService';
import readline from 'readline';

const handleKeypress = (): void => {
  console.log("Press r to start recording");
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (_str, key) => {
    if (key.name === 'r' && !recordService.getIsRecording()) {
      recordService.startRecording();
    }

    if (key.name === 's' && recordService.getIsRecording()) {
      recordService.stopRecording();
    }

    if (key.ctrl && key.name === 'c') {
      if (recordService.getIsRecording()) {
        recordService.stopRecording();
      }
      process.exit();
    }
  });
}

export default {
  handleKeypress,
};