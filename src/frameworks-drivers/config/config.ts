import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const {
  NODE_ENV = 'development',
  MONGO_DB_URL_PRODUCTION,
  MONGO_DB_URL_DEVELOPMENT,
  MONGO_DB_URL_TEST,
  PORT_DEV,
  PORT_PROD,
  PORT_TEST,
} = process.env;

const config = {
  production: {
    app: {
      port: PORT_PROD,
    },
    db: {
      url: MONGO_DB_URL_PRODUCTION,
    },
    api: {
      prefix: '/api',
    },
  },
  development: {
    app: {
      port: PORT_DEV,
    },
    db: {
      url: MONGO_DB_URL_DEVELOPMENT,
    },
    api: {
      prefix: '/api',
    },
  },
  test: {
    app: {
      port: PORT_TEST,
    },
    db: {
      url: MONGO_DB_URL_TEST,
    },
    api: {
      prefix: '/api',
    },
  },
};
const serverConfig = config[NODE_ENV];

export { serverConfig };
