const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        street: {
        type: String,
        required: true,
        },
        city: {
        type: String,
        required: true,
        },
        state: {
        type: String,
        required: false,
        },
        zip: {
        type: String,
        required: false,
        },

    });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;

