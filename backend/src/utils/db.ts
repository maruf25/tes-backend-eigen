import { Dialect, Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USERNAME as string;
const dbHost = "localhost";
const dbDriver = process.env.DB_DIALECT as Dialect;
const dbPassword = process.env.DB_PASSWORD;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
});

export default sequelizeConnection;
