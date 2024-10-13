import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../utils/db";
import Member from "./member";
import Book from "./book";

interface TransactionAttributes {
  id: string;
  MemberCode: string;
  BookCode: string;
  borrowDate: Date;
  returnDate?: Date | null;
  status: "BORROWED" | "RETURNED";

  Member?: Member;
  Book?: Book;
}

export interface TransactionInput
  extends Optional<
    TransactionAttributes,
    "id" | "MemberCode" | "BookCode" | "borrowDate" | "returnDate" | "status"
  > {}
export interface IngredientOuput extends Required<TransactionAttributes> {}

class Transaction
  extends Model<TransactionAttributes, TransactionInput>
  implements TransactionAttributes
{
  public id!: string;
  public MemberCode!: string;
  public BookCode!: string;
  public borrowDate!: Date;
  public returnDate?: Date | null;
  public status!: "BORROWED" | "RETURNED";

  public readonly Member?: Member;
  public readonly Book?: Book;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    MemberCode: {
      type: DataTypes.STRING,
      references: { model: Member, key: "code" },
    },
    BookCode: {
      type: DataTypes.STRING,
      references: { model: Book, key: "code" },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("BORROWED", "RETURNED"),
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
  }
);

export default Transaction;
