import express, { Request, Response } from 'express';
import recorderController from './controllers/recordController';

const app = express();
const port = 3000;

app.get("/", (_req: Request, _res: Response) => {
  _res.send('Server is running. Use /record to start the recording process.');
});

app.get("/record", (_req: Request, _res: Response) => {
  recorderController.handleKeypress();
  _res.send('Recording process started. Check the console for instructions.');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});