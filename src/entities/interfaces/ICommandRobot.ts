import Input from '../types/Input';

export default interface ICommandRobot {
  command(input: Input): Promise<Array<string>>;
}
