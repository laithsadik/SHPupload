import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createPet, getPet, deletePet, updatePet, getPets } from "../controllers/pet.controller.js";
const router = express.Router();

router.post("/create", verifyUser, createPet);
router.get("/getPet/:id", getPet);
router.delete("/delete/:id", verifyUser, deletePet);
router.post("/update/:id", verifyUser, updatePet);
router.get("/get", getPets);
export default router;
