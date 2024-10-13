import express from "express";
import { getAllBooks } from "../controllers/books";

const router = express.Router();

router.get("/existingbooks", getAllBooks);

export default router;
