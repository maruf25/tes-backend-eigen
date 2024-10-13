import { NextFunction, Request, Response } from "express";
import Member from "../models/member";
import Transaction from "../models/transaction";
import Book from "../models/book";
import { generateRandomId } from "../utils/generateRandomID";
import sequelizeConnection from "../utils/db";

export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  const codeMember = req.body.codeMember;
  const codeBook = req.body.codeBook;

  try {
    const member = await Member.findByPk(codeMember, {
      include: [{ model: Transaction, where: { status: "BORROWED" }, required: false }],
    });

    if (!member) {
      const error: any = new Error("Member not found");
      error.statusCode = 404;
      throw error;
    }

    // Member is currently not being penalized
    if (member?.penalized && member.penalized >= new Date()) {
      const error: any = new Error("Member is penalized, not allow to borrow books");
      error.statusCode = 403;
      throw error;
    }

    // Members may not borrow more than 2 books
    if (member.Transactions?.length && member.Transactions?.length >= 2) {
      const error: any = new Error("Member is not allowed to borrow more books");
      error.statusCode = 403;
      throw error;
    }

    const book = await Book.findByPk(codeBook, {
      include: [{ model: Transaction, where: { status: "BORROWED" }, required: false }],
    });

    if (!book) {
      const error: any = new Error("Book not found");
      error.statusCode = 404;
      throw error;
    }

    // Borrowed books are not borrowed by other members
    if (book.Transactions?.length && book.Transactions?.length > 0) {
      const error: any = new Error("Book is borrowed by another member");
      error.statusCode = 403;
      throw error;
    }

    const result = await sequelizeConnection.transaction(async () => {
      const borrowBook = await Transaction.create({
        id: generateRandomId(10),
        MemberCode: codeMember,
        BookCode: codeBook,
        borrowDate: new Date(),
        status: "BORROWED",
      });
      await book.update({ stock: book.stock - 1 });
      return { transaction: borrowBook };
    });

    res.status(201).json({ ...result });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  const codeMember = req.body.codeMember;
  const codeBook = req.body.codeBook;
  const id = req.params.transactionId;

  try {
    const transaction = await Transaction.findOne({
      where: { id: id, status: "BORROWED" },
      include: [{ model: Member }, { model: Book }],
    });

    if (!transaction) {
      const error: any = new Error("Transaction not found");
      error.statusCode = 404;
      throw error;
    }

    // The returned book is a book that the member has borrowed
    if (transaction?.Member?.code !== codeMember) {
      const error: any = new Error("Book can't return because member doesn't valid");
      error.statusCode = 403;
      throw error;
    }

    if (transaction?.Book?.code !== codeBook) {
      const error: any = new Error("Book can't return because book doesn't valid");
      error.statusCode = 403;
      throw error;
    }

    /** If the book is returned after more than 7 days, the member will be subject to a penalty.
     * Member with penalty cannot able to borrow the book for 3 days
     * */
    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

    const today = new Date();
    const nextThreeDays = new Date(today.setDate(today.getDate() + 3));

    let message = "success return book";
    if (Date.now() - transaction.borrowDate.getTime() >= sevenDaysInMillis) {
      await transaction.Member?.update({ penalized: nextThreeDays });
      message = "succes return book with penalized 3 days";
    }

    // return book
    const result = await sequelizeConnection.transaction(async () => {
      const returnedBook = await transaction.update({ returnDate: today, status: "RETURNED" });
      await transaction.Book?.update({ stock: transaction.Book.stock + 1 });
      return { transaction: returnedBook };
    });

    res.status(200).json({ message, ...result });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
