import Coordinates from '../types/Coordinates';
import Grid from '../types/Grid';
import Position from '../types/Position';

export default interface IMarsExplorationRepository {
  addScents(grid: Grid, positions: Array<Position>);
  getScents(grid: Grid): Promise<Array<Position>>;

  addExploredSurface(grid: Grid, coordinates: Array<Coordinates>);
  getExploredSurface(grid: Grid): Promise<Array<Coordinates>>;
}