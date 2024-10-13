import { NextFunction, Request, Response } from "express";
import Member from "../models/member";
import Transaction from "../models/transaction";
import sequelizeConnection from "../utils/db";

export const getAllMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: Transaction,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            sequelizeConnection.literal(`
            (SELECT COUNT(*)
             FROM Transactions AS t
             WHERE t.MemberCode = Member.code AND t.status = 'RETURNED')
          `),
            "history",
          ],

          [
            sequelizeConnection.literal(`
            (SELECT COUNT(*)
             FROM Transactions AS t
             WHERE t.MemberCode = Member.code AND t.status != 'RETURNED')
          `),
            "now",
          ],
        ],
      },
    });

    res.status(200).json({ members: members });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
