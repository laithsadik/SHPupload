import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createSecondHand, getSecondHand, deleteSecondHand, updateSecondHand, getSecondHands } from "../controllers/secondhand.controller.js";
const router = express.Router();

router.post("/create", verifyUser, createSecondHand);
router.get("/getSecondHand/:id", getSecondHand);
router.delete("/delete/:id", verifyUser, deleteSecondHand);
router.post("/update/:id", verifyUser, updateSecondHand);
router.get("/get", getSecondHands);
export default router;
