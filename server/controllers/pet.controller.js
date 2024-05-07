import Pet from "../models/pet.model.js";

export const createPet = async (req, res, next) => {
  try {
    const { regulations, ...rest } = req.body;
    const pet = await Pet.create(rest);
    return res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
};

export const getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return next(errorHandler(404, "pet not found"));
    }
    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  let pet;
  try {
    pet = await Pet.findById(req.params.id);
  } catch (error) {
    return next(errorHandler(404, "Pet not found"));
  }

  if (!pet) {
    return next(errorHandler(404, "Pet not found"));
  } else if (req.user.id !== pet.userRef) {
    return next(errorHandler(401, "You can only delete your own pet"));
  }
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json("Pet has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  let pet;
  try {
    pet = await Pet.findById(req.params.id);
  } catch (error) {
    return next(errorHandler(404, "Pet not found"));
  }

  if (!pet) {
    return next(errorHandler(404, "Pet not found"));
  }
  if (req.user.id !== pet.userRef) {
    return next(errorHandler(401, "You can only delete your own Pet"));
  }

  try {
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPet);
  } catch (error) {
    next(error);
  }
};

export const getPets = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const filter = {
      pettype: { $regex: searchTerm, $options: "i" },
    };

    if (
      req.query.pickPet !== undefined &&
      req.query.pickPet !== false &&
      req.query.pickPet !== "false" &&
      req.query.pickPet !== "choose animal"
    ) {
      filter.pickPet = req.query.pickPet;
    }

    if (req.query.action && req.query.action !== "choose action") {
      filter.action = req.query.action;
    }

    if (req.query.pettype && req.query.pettype !== "choose pet") {
      filter.pettype = req.query.pettype;
    }

    const pet = await Pet.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};
