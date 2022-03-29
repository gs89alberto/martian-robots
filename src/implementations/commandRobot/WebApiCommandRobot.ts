import fs from 'fs';
import path from 'path';
import HttpException from '../helpers/exceptions/HttpException';
import Input from '../../entities/types/Input';
import CommandRobot from '../../use-cases/CommandRobot';

class WebApiCommandRobot extends CommandRobot {
  async commandRobotFromWeb(request, response) {
    if (!(request && request.body && request.body['grid'] && request.body['robots']))
      throw new HttpException(400, 'Missing required field');
    const input: Input = {
      grid: request.body['grid'],
      robots: request.body['robots'],
    };
    const output: Array<string> = await this.command(input);
    if (!output) throw new HttpException(400, 'Incorrect input value(s)');
    this.recordLog(JSON.stringify(request.body), 'inputs.log');
    this.recordLog(JSON.stringify(output), 'outputs.log');
    response.json(output);
  }
  private recordLog(entry: string, logName: string): void {
    fs.appendFile(
      path.resolve(__dirname, `../../../logs/${logName}`),
      `${new Date(Date.now()).toLocaleString()} ${entry}\n`,
      'utf8',
      (err) => {
        if (err) throw err;
      }
    );
  }
}

export default WebApiCommandRobot;
