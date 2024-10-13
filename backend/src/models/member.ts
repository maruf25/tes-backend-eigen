import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../utils/db";
import Transaction from "./transaction";

interface MemberAttributes {
  code: string;
  name: string;
  Transactions?: Transaction[];

  penalized?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MemberInput extends Optional<MemberAttributes, "code" | "name"> {}
export interface MemberOuput extends Required<MemberAttributes> {}

class Member extends Model<MemberAttributes, MemberInput> implements MemberAttributes {
  public code!: string;
  public name!: string;
  public penalized?: Date | null;

  public readonly Transactions?: Transaction[];
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Member.init(
  {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    penalized: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
  }
);

export default Member;
