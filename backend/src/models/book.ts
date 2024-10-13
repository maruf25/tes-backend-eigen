import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../utils/db";
import Member from "./member";
import Transaction from "./transaction";

interface BookAttributes {
  code: string;
  title: string;
  author: string;
  stock: number;
  Transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookInput
  extends Optional<BookAttributes, "code" | "title" | "author" | "stock"> {}
export interface IngredientOuput extends Required<BookAttributes> {}

class Book extends Model<BookAttributes, BookInput> implements BookAttributes {
  public code!: string;
  public title!: string;
  public author!: string;
  public stock!: number;
  public readonly Transactions?: Transaction[];

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
  }
);

export default Book;
