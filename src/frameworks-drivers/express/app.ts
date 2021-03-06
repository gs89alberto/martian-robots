import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import MarsExplorationRepositoryImpl from '../../implementations/marsExplorationRepository/MongoMarsExplorationRepository';
import WebApiCommandRobotImpl from '../../implementations/commandRobot/WebApiCommandRobot';
import MongoDBAdapter from '../persistence/marsDB';
import { serverConfig } from './../config/config';
import errorMiddleware from './middleware/error-middleware';
import { createLogFile } from '../utils/logs';

const app: Express = express();

app.use(bodyParser.json());

createLogFile('inputs.log');
createLogFile('outputs.log');
app.use(morgan('combined', { stream: createLogFile('express-requests.log') }));

const mongoDbAdapter = new MongoDBAdapter(serverConfig.db.url);
mongoDbAdapter.init();
const martsExplorationRepository = new MarsExplorationRepositoryImpl(mongoDbAdapter);
const commandRobotInstance = new WebApiCommandRobotImpl(martsExplorationRepository);

app.post(`${serverConfig.api.prefix}/commandRobot`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commandRobotInstance.commandRobotFromWeb(req, res);
    
  } catch (e) {
    next(e);
  }
});

app.use(errorMiddleware);

export default app;
