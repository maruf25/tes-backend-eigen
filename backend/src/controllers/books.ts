import { NextFunction, Request, Response } from "express";
import Book from "../models/book";
import Transaction from "../models/transaction";
import { Op } from "sequelize";
import sequelizeConnection from "../utils/db";

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get All book and quantities
    const result = await sequelizeConnection.transaction(async () => {
      const whereCondition = {
        [Op.or]: [
          {
            code: {
              [Op.eq]: sequelizeConnection.literal(`(
              SELECT BookCode FROM Transactions WHERE status IS NULL
            )`),
            },
          },
          {
            code: {
              [Op.notIn]: sequelizeConnection.literal(`(
              SELECT BookCode FROM Transactions WHERE status = 'BORROWED'
            )`),
            },
          },
        ],
      };

      const books = await Book.findAll({
        include: {
          model: Transaction,
          required: false,
          attributes: [],
        },
        where: whereCondition,
      });

      const sumStock = await Book.sum("stock", { where: whereCondition });

      return { books: books, quantityTitleBook: books.length, quantityStockBook: sumStock };
    });

    res.status(200).json(result);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
