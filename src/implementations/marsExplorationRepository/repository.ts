import IMarsExplorationRepository from '../../entities/interfaces/IMarsExplorationRepository';
import Coordinates from '../../entities/types/Coordinates';
import Grid from '../../entities/types/Grid';
import Position from '../../entities/types/Position';

class mongoMarsExplorationRepository implements IMarsExplorationRepository {
  private dataSource;
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async addScents(grid: Grid, positions: Position[]) {
    this.dataSource.insertScents(grid, positions);
  }
  async getScents(grid: Grid): Promise<Position[]> {
    const scents = await this.dataSource.getScents(grid);
    return scents.reduce((acc: Position[], curr) => {

      const currPosition = curr.toObject().position;
      const position: Position = {
        coordinates: currPosition.coordinates,
        orientation: currPosition.orientation,
      };
      acc.push(position);
      return acc;
    }, []);
  }
  async addExploredSurface(grid: Grid, coordinates: Coordinates[]) {
    this.dataSource.insertExploredSurface(grid, coordinates);
  }
  async getExploredSurface(grid: Grid): Promise<Coordinates[]> {
    const exploredSurface = await this.dataSource.getExploredSurface(grid);
    return exploredSurface.reduce((acc: Coordinates[], curr) => {
      const currCoordinates = curr.toObject().coordinates;
      const coordinates: Coordinates = {
        x: currCoordinates.x,
        y: currCoordinates.y,
      };
      acc.push(coordinates);
      return acc;
    }, []);
  }
}

export default mongoMarsExplorationRepository;
