import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createVehicle, getVehicle,deleteVehicle, updateVehicle, getVehicles } from "../controllers/vehicle.controller.js";
const router = express.Router();

router.post("/create", verifyUser, createVehicle);
router.get("/getVehicle/:id", getVehicle);
router.post("/update/:id", verifyUser, updateVehicle);
router.delete("/delete/:id", verifyUser, deleteVehicle);
router.get("/get", getVehicles);
export default router;
