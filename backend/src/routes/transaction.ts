import express from "express";
import { borrowBook, returnBook } from "../controllers/transaction";

const router = express.Router();

router.post("/borrow", borrowBook);
router.put("/return/:transactionId", returnBook);

export default router;
