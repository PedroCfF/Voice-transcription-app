import recordService from '../services/recordService';
import readline from 'readline';

function handleKeypress() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (_str, key) => {
    console.log(recordService.getIsRecording());

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