import dotenv, {config} from 'dotenv';
dotenv.config()

export const mongoConfig = {
  serverUrl: process.env.MONGO_SERVER_URL,
  database: process.env.MONGO_DATABASE_NAME
};

