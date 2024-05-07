import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    pettype: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    ageper: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pickPet: {
      type: String,
      required: true,
    },
    disable: {
      type: Boolean,
      required: false,
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

const pet = mongoose.model("pet", petSchema);

export default pet;
