import mongoose from "mongoose";

const secondhandSchema = new mongoose.Schema(
  {
    secondhandcategory: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    productname: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pickSecondHand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
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

const secondhand = mongoose.model("secondhand", secondhandSchema);

export default secondhand;
