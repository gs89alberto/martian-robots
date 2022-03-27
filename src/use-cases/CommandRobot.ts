import Coordinates from '../entities/types/Coordinates';
import ICommandRobot from '../entities/interfaces/ICommandRobot';
import IMarsExplorationRepository from '../entities/interfaces/IMarsExplorationRepository';
import Grid from '../entities/types/Grid';
import Input from '../entities/types/Input';
import Position from '../entities/types/Position';
import Robot from '../entities/types/Robot';
import Orientation from '../entities/types/Orientation';

abstract class CommandRobot implements ICommandRobot {
  private bounds = {
    min: { x: 0, y: 0 },
    max: { x: 50, y: 50 },
  };
  protected marsExplorationRepository: IMarsExplorationRepository;

  constructor(marsExplorationRepository: IMarsExplorationRepository) {
    this.marsExplorationRepository = marsExplorationRepository;
  }

  private checkValidCoordinates(x: number, y: number): boolean {
    return x >= this.bounds.min.x && y >= this.bounds.min.x && x <= this.bounds.max.x && y <= this.bounds.max.y;
  }

  private isWithinBounds(grid: Grid, position: Position): boolean {
    const coordX: number = position.coordinates.x;
    const coordY: number = position.coordinates.y;
    return coordX >= this.bounds.min.x && coordY >= this.bounds.min.x && coordX <= grid.width && coordY <= grid.height;
  }

  private moveRobot(position: Position, instruction: string): Position {
    const coordX: number = position.coordinates.x;
    const coordY: number = position.coordinates.y;
    const orientation: Orientation = position.orientation;

    const movements = {
      N: {
        L: { coordinates: { x: coordX, y: coordY }, orientation: 'W' },
        R: { coordinates: { x: coordX, y: coordY }, orientation: 'E' },
        F: { coordinates: { x: coordX, y: coordY + 1 }, orientation: orientation },
      },
      S: {
        L: { coordinates: { x: coordX, y: coordY }, orientation: 'E' },
        R: { coordinates: { x: coordX, y: coordY }, orientation: 'W' },
        F: { coordinates: { x: coordX, y: coordY - 1 }, orientation: orientation },
      },
      E: {
        L: { coordinates: { x: coordX, y: coordY }, orientation: 'N' },
        R: { coordinates: { x: coordX, y: coordY }, orientation: 'S' },
        F: { coordinates: { x: coordX + 1, y: coordY }, orientation: orientation },
      },
      W: {
        L: { coordinates: { x: coordX, y: coordY }, orientation: 'S' },
        R: { coordinates: { x: coordX, y: coordY }, orientation: 'N' },
        F: { coordinates: { x: coordX - 1, y: coordY }, orientation: orientation },
      },
    };
    return movements[orientation][instruction];
  }

  private async processIntruction(
    grid: Grid,
    robot: Robot,
    scents: Position[]
  ): Promise<{ status: 'lost' | 'ignored' | 'success'; position: Position; processedPath: Coordinates[] }> {
    const instructions: string[] = [...robot.instruction];
    let currentPosition: Position = robot.position;

    let status: 'lost' | 'ignored' | 'success' = 'success';
    const processedPath: Coordinates[] = [{ x: robot.position.coordinates.x, y: robot.position.coordinates.y }];
    instructions.every((instruction) => {
      if (
        instruction === 'F' &&
        scents.some(
          (scent) =>
            scent.coordinates.x === currentPosition.coordinates.x &&
            scent.coordinates.y === currentPosition.coordinates.y &&
            scent.orientation === currentPosition.orientation
        )
      )
        status = 'ignored';
      if (status !== 'ignored') {
        let nextPosition: Position = this.moveRobot(currentPosition, instruction);
        if (this.isWithinBounds(grid, nextPosition)) {
          currentPosition = nextPosition;
          processedPath.push({ x: currentPosition.coordinates.x, y: currentPosition.coordinates.y });
        } else {
          status = 'lost';
        }
      }
      return status === 'success';
    });

    return { status: status, position: currentPosition, processedPath: processedPath };
  }

  private async processRobot(
    grid: Grid,
    robot: Robot,
    scents: Position[]
  ): Promise<{ status: 'lost' | 'ignored' | 'success'; position: Position; processedPath: Coordinates[] }> {
    if (robot.instruction.length > 100) throw new Error('Instructions string cannot exceed 100 characters');
    if (!this.isWithinBounds(grid, robot.position)) throw new Error('Position coordinates must be within grid bounds');
    return this.processIntruction(grid, robot, scents);
  }

  async command(input: Input): Promise<Array<string>> {
    try {
      const { grid, robots } = input;
      if (!this.checkValidCoordinates(grid.width, grid.height))
        throw new Error('Grid width and height must be 50 or less');
      const scents: Position[] = await this.marsExplorationRepository.getScents(grid);
      const exploredSurface: Coordinates[] = await this.marsExplorationRepository.getExploredSurface(grid);

      const output: Array<string> = [];
      const newScents: Position[] = [];
      const paths: Coordinates[] = [];

      for await (const robot of robots) {
        const processResult: {
          status: 'lost' | 'ignored' | 'success';
          position: Position;
          processedPath: Coordinates[];
        } = await this.processRobot(grid, robot, [...scents, ...newScents]);
        const processResultPosition: Position = processResult.position;
        let robotOutput: string = `${processResultPosition.coordinates.x} ${processResultPosition.coordinates.y} ${processResultPosition.orientation}`;
        if (processResult.status === 'lost') {
          newScents.push(processResultPosition);
          robotOutput += ' LOST';
        }
        if (processResult.status === 'ignored') {
          robotOutput = 'IGNORED';
        }
        if (processResult.status === 'success') {
          paths.push(...processResult.processedPath);
        }
        output.push(robotOutput);
      }

      const currentExploredSurfaces: Array<Coordinates> = paths.reduce((acc: Coordinates[], path: Coordinates) => {
        if (!acc.some((prevCoords) => path.x === prevCoords.x && path.y === prevCoords.y)) acc.push(path);
        return acc;
      }, []);

      const newExploredSurface: Array<Coordinates> = currentExploredSurfaces.filter(
        (currCoords: Coordinates) =>
          !exploredSurface.some((prevCoords) => currCoords.x === prevCoords.x && currCoords.y === prevCoords.y)
      );

      if (newExploredSurface.length) await this.marsExplorationRepository.addExploredSurface(grid, newExploredSurface);
      if (newScents.length) await this.marsExplorationRepository.addScents(grid, newScents);

      return output;
    } catch (error) {
      return null;
    }
  }
}

export default CommandRobot;
