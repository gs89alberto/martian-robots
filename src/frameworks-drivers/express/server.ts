import app from './app';
import { serverConfig } from './../config/config';

app.listen(serverConfig.app.port, () => {
  console.log(`listening on port ${serverConfig.app.port}`);
});
