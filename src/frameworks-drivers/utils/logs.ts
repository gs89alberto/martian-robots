import fs from 'fs';
import path from 'path';

function createLogFile(fileName: string): fs.WriteStream {
  let logDir: fs.PathLike = path.resolve(__dirname, '../../../logs/');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return fs.createWriteStream(`${logDir}/${fileName}`, { flags: 'a' });
}

export { createLogFile };
