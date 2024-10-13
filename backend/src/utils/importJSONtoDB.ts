import * as fs from "fs";
import path from "path";
import Member from "../models/member";
import Book from "../models/book";

async function importData() {
  try {
    // Baca file JSON
    const rawdata: string = fs.readFileSync(
      path.join(import.meta.dirname, "../../member.json"),
      "utf8"
    );
    const data = JSON.parse(rawdata); // Parse JSON

    // Pastikan data sudah berbentuk array
    if (Array.isArray(data)) {
      for (const item of data) {
        // Masukkan setiap item ke dalam database menggunakan Sequelize
        await Member.create(item);
      }
      console.log("Data berhasil diimport ke database.");
    } else {
      console.error("Data JSON tidak berbentuk array.");
    }
  } catch (error) {
    console.error("Error mengimpor data:", error);
  }
}

export default importData;
