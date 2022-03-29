import app from '../../../src/frameworks-drivers/express/app';
import supertest from 'supertest';
import mongoose from 'mongoose';
import Input from '../../../src/entities/types/Input';
import { ExploredSurfaces } from '../../../src/frameworks-drivers/persistence/models/exploredSurfaces';
import { Scents } from '../../../src/frameworks-drivers/persistence/models/scents';

const request = supertest(app);

describe('commandRobot endpoint test', () => {
  beforeEach(async () => {
    await ExploredSurfaces.deleteMany({});
    await Scents.deleteMany({});
  });
  afterAll(() => {
    mongoose.disconnect();
  });
  it('should turn the robot 90º left, keeping the same coordinates position', async () => {
    const inputTestL: Input = {
      grid: { width: 2, height: 3 },
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
    const res = await request.post('/api/commandRobot').send(inputTestL);
    const expectedOutput: string[] = ['1 1 W'];
    expect(res.body).toStrictEqual(expectedOutput);
    expect(res.status).toBe(200);
  });
  it('should control missing params on input', async () => {
    const wrongInputTest = {
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
    const res = await request.post('/api/commandRobot').send(wrongInputTest);
    expect(res.body.message).toBe('Missing required field');
    expect(res.status).toBe(400);
  });
  it('should control wrong input values', async () => {
    const wrongInputTest: Input = {
      grid: { width: 23232323, height: 2 },
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
    const res = await request.post('/api/commandRobot').send(wrongInputTest);
    expect(res.body.message).toBe('Incorrect input value(s)');
    expect(res.status).toBe(400);
  });
});
