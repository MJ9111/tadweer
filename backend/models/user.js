const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  

  cart_id: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },

  isAdmin: {
    type: Boolean,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

userSchema.set('toJSON', {
  transform: (doc, obj) => {
    delete obj.hashedPassword;
  },
});

module.exports = model('User', userSchema);
