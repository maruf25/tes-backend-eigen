import dotenv from "dotenv";
dotenv.config();
import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from "express";
import sequelizeConnection from "./utils/db";
import bodyParser from "body-parser";
import cron from "node-cron";

import swaggerUI from "swagger-ui-express";
import swaggerJSON from "../apiDocs.json";

// Models
import MemberModels from "./models/member";
import BookModels from "./models/book";
import TransactionModels from "./models/transaction";

// Routes
import MemberRoutes from "./routes/member";
import TransactionRoutes from "./routes/transaction";
import BookRoutes from "./routes/book";
import { updatePenalized } from "./utils/updatePenalize";

const app: Express = express();
app.use(bodyParser.json());

// Relationship
MemberModels.hasMany(TransactionModels);
TransactionModels.belongsTo(MemberModels, { foreignKey: "MemberCode" });
BookModels.hasMany(TransactionModels);
TransactionModels.belongsTo(BookModels, { foreignKey: "BookCode" });

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(MemberRoutes);
app.use(TransactionRoutes);
app.use(BookRoutes);

const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status: number = error.statusCode || 500;
  const message: string = error.message || "Internal Server Error";
  const data = error.data || null;

  res.status(status).json({ message: message, data: data });
};

app.use(errorHandler);

sequelizeConnection
  .sync()
  .then(async () => {
    console.log("connect database");

    cron.schedule("0 8 * * *", updatePenalized);

    app.listen(process.env.PORT, () =>
      console.log(`Server Running on port ${process.env.PORT}....`)
    );
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    process.exit(1);
  });
