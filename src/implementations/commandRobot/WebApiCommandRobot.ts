import HttpException from '../../frameworks-drivers/express/exceptions/HttpException';
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
    response.json(output);
  }
}

export default WebApiCommandRobot;
