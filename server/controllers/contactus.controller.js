import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//Send contactus form to email
export const contactUs = async (req, res) => {
  let { firstname, lastname, email, subject, message } = req.body;
  const name = firstname + " " + lastname;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_SERVER_MAIL,
      pass: process.env.PASS_MAIL,
    },
  });

  let mailOptions = {
    from: process.env.SMTP_SERVER_MAIL,
    to: "othman.habb.4900@gmail.com",
    replyTo: email,
    subject: `FinanceAPP - ${subject}`,
    text: `Personal Name: ${name} \n` + message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json("An error occurred while sending the email.");
    } else {
      res.status(200).json("Contacatus successfully.");
    }
  });
};
