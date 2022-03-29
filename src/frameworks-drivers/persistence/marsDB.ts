import mongoose from 'mongoose';
import { Scents, ScentsInput } from './models/scents';
import { ExploredSurfaces, ExploredSurfacesInput } from './models/exploredSurfaces';
import Grid from '../../entities/types/Grid';
import Position from '../../entities/types/Position';
import Coordinates from '../../entities/types/Coordinates';

class MongoDBAdapter {
  private dbUrl: string;
  constructor(dbUrl: string) {
    this.dbUrl = dbUrl;
  }

  async init() {
    await mongoose.connect(this.dbUrl);
  }

  async insertScents(grid: Grid, positions: Position[]) {
    const input: ScentsInput[] = positions.reduce((acc: ScentsInput[], position: Position) => {
      acc.push({ grid: grid, position: position });
      return acc;
    }, []);

    await Scents.create(input);
  }
  async getScents(grid: Grid): Promise<Position[]> {
    return await Scents.find({ 'grid.width': grid.width, 'grid.height': grid.height }, 'position');
  }
  async insertExploredSurface(grid: Grid, coordinates: Coordinates[]) {
    const input: ExploredSurfacesInput[] = coordinates.reduce((acc: ExploredSurfacesInput[], coords: Coordinates) => {
      acc.push({ grid: grid, coordinates: coords });
      return acc;
    }, []);

    await ExploredSurfaces.create(input);
  }
  async getExploredSurface(grid: Grid): Promise<Array<Coordinates>> {
    return await ExploredSurfaces.find({ 'grid.width': grid.width, 'grid.height': grid.height }, 'coordinates');
  }
}

export default MongoDBAdapter;
