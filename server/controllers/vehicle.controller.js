import Vehicle from "../models/vehicle.model.js";

export const createVehicle = async (req, res, next) => {
  try {
    const { regulations, ...rest } = req.body;
    const vehicle = await Vehicle.create(rest);
    return res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found"));
    }
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  let vehicle;
  try {
    vehicle = await Vehicle.findById(req.params.id);
  } catch (error) {
    return next(errorHandler(404, "Vehicle not found"));
  }

  if (!vehicle) {
    return next(errorHandler(404, "Vehicle not found"));
  } else if (req.user.id !== vehicle.userRef) {
    return next(errorHandler(401, "You can only delete your own Vehicle"));
  }
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json("Vehicle has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  let vehicle;
  try {
    vehicle = await Vehicle.findById(req.params.id);
  } catch (error) {
    return next(errorHandler(404, "Vehicle not found"));
  }

  if (!vehicle) {
    return next(errorHandler(404, "Vehicle not found"));
  }
  if (req.user.id !== vehicle.userRef) {
    return next(errorHandler(401, "You can only delete your own vehicle"));
  }

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedVehicle);
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const filter = {
      manufacturer: { $regex: searchTerm, $options: "i" },
    };

    if (
      req.query.pickVehicle !== undefined &&
      req.query.pickVehicle !== false &&
      req.query.pickVehicle !== "false" &&
      req.query.pickVehicle !== "choose vehicle"
    ) {
      filter.vehicletype = req.query.pickVehicle;
    }

    if (req.query.model && req.query.model !== "choose model") {
      filter.model = req.query.model;
    }

    if (
      req.query.manufacturer &&
      req.query.manufacturer !== "choose manufacturer"
    ) {
      filter.manufacturer = req.query.manufacturer;
    }

    const vehicles = await Vehicle.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};
