import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import Vehicle from "../models/vehicle.model.js";
import Pet from "../models/pet.model.js";
import SecondHand from "../models/secondhand.model.js";
import Joi from "joi";

export const test = (req, res) => {
  res.json({
    message: "hallow world",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_Token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only get your own listings"));
  try {
    const listing = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.params.id });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserVehicle = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only get your own vehicles"));
  try {
    const vehicle = await Vehicle.find({ userRef: req.params.id });
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};
export const getUserPet = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only get your own pets"));
  try {
    const pet = await Pet.find({ userRef: req.params.id });
    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const getUserSecondHand = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only get your own SecondHands"));
  try {
    const secondHand = await SecondHand.find({ userRef: req.params.id });
    res.status(200).json(secondHand);
  } catch (error) {
    next(error);
  }
};
