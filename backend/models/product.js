const mongoose = require("mongoose");

const User = require("../models/user");

const ratingSchema = new mongoose.Schema({
  rate: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imageP: {
      type: String,
      required: true,
    },
    imageS: {
      type: String,
      required: false,
    },

    imageT: {
      type: String,
      required: false,
    },

    imageF: {
      type: String,
      required: false,
    },

    rating: [ratingSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
