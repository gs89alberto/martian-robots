import CommandRobot from '../../../src/use-cases/CommandRobot';
import IMarsExplorationRepository from '../../../src/entities/interfaces/IMarsExplorationRepository';
import Grid from '../../../src/entities/types/Grid';
import Position from '../../../src/entities/types/Position';
import Coordinates from '../../../src/entities/types/Coordinates';
import Input from '../../../src/entities/types/Input';

class MarsExploration implements IMarsExplorationRepository {
  addScents(grid: Grid, positions: Position[]) {}
  async getScents(grid: Grid): Promise<Position[]> {
    return [
      {
        coordinates: { x: 0, y: 0 },
        orientation: 'W',
      },
    ];
  }
  addExploredSurface(grid: Grid, coordinates: Coordinates[]) {}
  async getExploredSurface(grid: Grid): Promise<Coordinates[]> {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
    ];
  }
}

class TestCommandRobot extends CommandRobot {
  async commandTest(input: Input): Promise<Array<string>> {
    return this.command(input);
  }
}

describe('test CommandRobot functionality', () => {
  const commandRobot = new TestCommandRobot(new MarsExploration());

  it('should turn the robot 90º left, keeping the same coordinates position', () => {
    const inputTestL: Input = {
      grid: { width: 2, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 1, y: 1 },
            orientation: 'N',
          },
          instruction: 'L',
        },
      ],
    };
    const expectedOutput: string[] = ['1 1 W'];
    expect(commandRobot.commandTest(inputTestL)).resolves.toStrictEqual(expectedOutput);
  });
  it('should turn the robot 90º right, keeping the same coordinates position', () => {
    const inputTestR: Input = {
      grid: { width: 2, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 1, y: 1 },
            orientation: 'N',
          },
          instruction: 'R',
        },
      ],
    };
    const expectedOutput: string[] = ['1 1 E'];
    expect(commandRobot.commandTest(inputTestR)).resolves.toStrictEqual(expectedOutput);
  });
  it('should move the robot one step forward, keeping the same orientation', () => {
    const inputTestR: Input = {
      grid: { width: 2, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 1, y: 1 },
            orientation: 'N',
          },
          instruction: 'F',
        },
      ],
    };
    const expectedOutput: string[] = ['1 2 N'];
    expect(commandRobot.commandTest(inputTestR)).resolves.toStrictEqual(expectedOutput);
  });
  it('should be a lost robot', () => {
    const inputTest: Input = {
      grid: { width: 2, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 1, y: 2 },
            orientation: 'N',
          },
          instruction: 'F',
        },
      ],
    };
    const expectedOutput: string[] = ['1 2 N LOST'];
    expect(commandRobot.commandTest(inputTest)).resolves.toStrictEqual(expectedOutput);
  });
  it('should be a ignored instruction', () => {
    const inputTest: Input = {
      grid: { width: 2, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 0, y: 0 },
            orientation: 'W',
          },
          instruction: 'F',
        },
      ],
    };
    const expectedOutput: string[] = ['IGNORED'];
    expect(commandRobot.commandTest(inputTest)).resolves.toStrictEqual(expectedOutput);
  });
  it("should not make the robot moves as it doesn't receive any instruction", () => {
    const inputTest: Input = {
      grid: { width: 2, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 0, y: 0 },
            orientation: 'W',
          },
          instruction: '',
        },
      ],
    };
    const expectedOutput: string[] = ['0 0 W'];
    expect(commandRobot.commandTest(inputTest)).resolves.toStrictEqual(expectedOutput);
  });
  it('should return null for a bad input given', () => {
    const inputTest: Input = {
      grid: { width: 222222, height: 2 },
      robots: [
        {
          position: {
            coordinates: { x: 0, y: 0 },
            orientation: 'W',
          },
          instruction: '',
        },
      ],
    };
    expect(commandRobot.commandTest(inputTest)).resolves.toBeNull();
  });
  it('should control a wrong grid size', () => {
    const inputTest: Input = {
      grid: { width: 0, height: 0 },
      robots: [
        {
          position: {
            coordinates: { x: 1, y: 1 },
            orientation: 'W',
          },
          instruction: '',
        },
      ],
    };
    expect(commandRobot.commandTest(inputTest)).resolves.toBeNull();
  });
});
