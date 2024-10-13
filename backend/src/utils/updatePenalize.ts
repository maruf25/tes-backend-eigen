import { Op } from "sequelize";
import Member from "../models/member";

export const updatePenalized = async () => {
  try {
    const members = await Member.findAll({
      where: {
        penalized: {
          [Op.not]: null,
        },
      },
    });

    if (members.length > 0) {
      for (const member of members) {
        if (member.penalized && member.penalized?.getTime() <= Date.now()) {
          await member.update({ penalized: null });
          console.log("Member not penalized again : " + member.name);
        }
      }
      return;
    }
    console.log("Member Penalized not found");
  } catch (error) {
    console.log(error);
  }
};
