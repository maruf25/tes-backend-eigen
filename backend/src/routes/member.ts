import express from "express";
import { getAllMember } from "../controllers/member";

const router = express.Router();

router.get("/members", getAllMember);

export default router;
