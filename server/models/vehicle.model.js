import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    enginecapacity: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    monthgettingontheroad: {
      type: String,
      required: true,
    },
    monthtest: {
      type: String,
      required: false,
    },
    yeartest: {
      type: String,
      required: false,
    },
    withOutCheck: {
      type: Boolean,
      required: false,
    },
    disable: {
      type: Boolean,
      required: false,
    },
    hand: {
      type: String,
      required: true,
    },
    currentownership: {
      type: String,
      required: true,
    },
    previousownership: {
      type: String,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    transmission: {
      type: String,
      required: false,
    },
    enginetype: {
      type: String,
      required: false,
    },
    vehicletype: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: true,
    },
    areas: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    flexible: {
      type: Boolean,
      required: false,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("vehicle", vehicleSchema);

export default Vehicle;
