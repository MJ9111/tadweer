const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },

    products: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          total_price: {
            type: Number,
            required: true,
          },
        }
      ],

    address_id: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },

    order_status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        required: true,
    },
    order_date: {
        type: Date,
        default: Date.now,
    },

    payment_method: {
        type: String,
        enum: ['Cash on Delivery', 'Credit Card', 'Debit Card'],
        required: false,
    },
    

    total_Cost: {
        type: Number,
        required: true,
    },

    });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;