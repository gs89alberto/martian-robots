import mongoose, { Schema, Model, Document } from 'mongoose';
import Coordinates from '../../../entities/types/Coordinates';
import Grid from '../../../entities/types/Grid';

type ExploredSurfacesDocument = Document & {
  grid: Grid;
  coordinates: Coordinates;
};

type ExploredSurfacesInput = {
  grid: ExploredSurfacesDocument['grid'];
  coordinates: ExploredSurfacesDocument['coordinates'];
};

const exploredSurfacesSchema = new Schema(
  {
    grid: {
      type: { width: { type: Schema.Types.Number }, height: { type: Schema.Types.Number } },
      required: true,
    },
    coordinates: {
      type: {
        x: { type: Schema.Types.Number },
        y: { type: Schema.Types.Number },
      },
      required: true,
    },
  },
  {
    collection: 'exploredSurfaces',
    timestamps: true,
    versionKey: false,
  }
);

const ExploredSurfaces: Model<ExploredSurfacesDocument> = mongoose.model<ExploredSurfacesDocument>(
  'ExploredSurfaces',
  exploredSurfacesSchema
);

export { ExploredSurfaces, ExploredSurfacesInput, ExploredSurfacesDocument };
