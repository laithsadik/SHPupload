import express from "express";
import { contactUs } from "../controllers/contactus.controller.js";
const router = express.Router();

router.post("/contactus", contactUs);


export default router;
