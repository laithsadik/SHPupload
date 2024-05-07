import SecondHand from "../models/secondhand.model.js";

export const createSecondHand = async (req, res, next) => {
  try {
    const { regulations, ...rest } = req.body;
    const secondhand = await SecondHand.create(rest);
    return res.status(201).json(secondhand);
  } catch (error) {
    next(error);
  }
};

export const getSecondHand = async (req, res, next) => {
  try {
    const secondhand = await SecondHand.findById(req.params.id);
    if (!secondhand) {
      return next(errorHandler(404, "secondhand product not found"));
    }
    res.status(200).json(secondhand);
  } catch (error) {
    next(error);
  }
};

export const deleteSecondHand = async (req, res, next) => {
  let secondHand;
  try {
    secondHand = await SecondHand.findById(req.params.id);
  } catch (error) {
    return next(errorHandler(404, "secondHand product not found"));
  }

  if (!secondHand) {
    return next(errorHandler(404, "secondHand product not found"));
  } else if (req.user.id !== secondHand.userRef) {
    return next(
      errorHandler(401, "You can only delete your own secondHand product")
    );
  }
  try {
    await SecondHand.findByIdAndDelete(req.params.id);
    res.status(200).json("secondHand product has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getSecondHands = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const filter = {
      secondhandcategory: { $regex: searchTerm, $options: "i" },
    };

    if (
      req.query.pickSecondHand !== undefined &&
      req.query.pickSecondHand !== false &&
      req.query.pickSecondHand !== "false" &&
      req.query.pickSecondHand !== "choose category"
    ) {
      filter.pickSecondHand = req.query.pickSecondHand;
    }

    if (
      req.query.modelSecondHand &&
      req.query.modelSecondHand !== "choose model"
    ) {
      filter.model = req.query.modelSecondHand;
    }

    if (
      req.query.secondhandcategory &&
      req.query.secondhandcategory !== "choose secondhand"
    ) {
      filter.secondhandcategory = req.query.secondhandcategory;
    }

    const secondhand = await SecondHand.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(secondhand);
  } catch (error) {
    next(error);
  }
};

export const updateSecondHand = async (req, res, next) => {
  let secondhand;
  try {
    secondhand = await SecondHand.findById(req.params.id);
  } catch (error) {
    return next(errorHandler(404, "secondhand product not found"));
  }

  if (!secondhand) {
    return next(errorHandler(404, "secondhand product not found"));
  }
  if (req.user.id !== secondhand.userRef) {
    return next(
      errorHandler(401, "You can only delete your own secondhand product")
    );
  }

  try {
    const updatedSecondHand = await SecondHand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedSecondHand);
  } catch (error) {
    next(error);
  }
};
