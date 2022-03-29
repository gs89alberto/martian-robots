import mongoose, { Schema, Model, Document } from 'mongoose';

type ScentsDocument = Document & {
  grid: {
    width: number;
    height: number;
  };
  position: {
    coordinates: { x: number; y: number };
    orientation: 'N' | 'S' | 'E' | 'W';
  };
};

type ScentsInput = {
  grid: ScentsDocument['grid'];
  position: ScentsDocument['position'];
};

const scentsSchema = new Schema(
  {
    grid: {
      type: {
        width: { type: Schema.Types.Number },
        height: { type: Schema.Types.Number },
      },
      required: true,
    },
    position: {
      type: {
        coordinates: {
          x: { type: Schema.Types.Number },
          y: { type: Schema.Types.Number },
        },
        orientation: { type: Schema.Types.String, enum: ['N', 'S', 'E', 'W'] },
      },
      required: true,
    },
  },
  {
    collection: 'scents',
    timestamps: true,
    versionKey: false,
  }
);

const Scents: Model<ScentsDocument> = mongoose.model<ScentsDocument>('scents', scentsSchema);

export { Scents, ScentsInput, ScentsDocument };
