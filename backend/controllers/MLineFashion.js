const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");

// Models
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const Address = require("../models/address");

// Middleware

// ========= Public Routes ==============

// Home page
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);

}})

//View all products page .. 'collection'
router.get("/products", async (req, res) => {
  try {
    const product = await Product.find({});

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//show specific product
router.get("/products/:productsId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productsId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/products/:productsId/rating", async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const product = await Product.findById(req.params.productsId);

    product.rating.push(req.body);
    await product.save();

    const newRating = product.rating[product.rating.length - 1];

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======== Protected Routes ============
router.use(verifyToken);

//create a new product to the cart of a user

router.post("/cart/add/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate quantity from request body
    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ user_id: user._id });
    if (!cart) {
      cart = new Cart({ user_id: user._id, products: [] });
    }

    const existingProduct = cart.products.find(
      (item) => item.product_id.toString() === product._id.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.total_price += product.price * quantity;
    } else {
      cart.products.push({
        product_id: product._id,
        quantity: quantity,
        total_price: product.price * quantity,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// View the cart of a user
router.get("/shopping-cart/:userId",verifyToken ,async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "No user found" });

    // Check if the user is the owner of the cart or an admin
    if (user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const cart = await Cart.findOne({ user_id: userId }) .populate('products.product_id').exec();;
    if (!cart)
      return res.status(404).json({ message: "No cart found for this user" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete('/shopping-cart/:productId', async (req, res) => {
  const  productId  = req.params.productId; 

  try {
    
    const user = await User.findById(req.user._id);
    const cart = await Cart.findOne(user.cart_id);
    if (!cart) {
      return res.status(404).json({ message: "No cart found for this user" });
    }

    // Find the product index in the products array
    const productIndex = cart.products.findIndex(item => item.product_id.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Remove the product from the array
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    // Respond with the updated cart
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// orders:
// create an order from a cart of a user
router.post("/shopping-cart/order/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Validate the authenticated user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "No user found" });

    // Check if the user is the owner of the cart .
    if (user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const cart = await Cart.findOne(user.cart_id);

    if (!cart)
      return res.status(404).json({ message: "No cart found for this user" });

    // Create a new order from the cart
    const newOrder = {
      user_id: userId,
      cart_id: cart._id,
      products: cart.products,
      address_id: req.body.address,
      order_status: "Pending", // Default order status
      payment_method: req.body.payment_method,
      total_Cost: cart.products.reduce(
        (acc, item) => acc + item.total_price,
        0
      ),
    };
    // Save the order to the database
    const order = await Order.create(newOrder);

    if (!order)
      return res.status(500).json({ message: "Failed to create order" });

    // Clear the cart
    cart.products = [];
    await cart.save();  

    res.status(201).json(order);
  } catch (error) {

    res.status(500).json({ message: "Server error", error });
  }
});






//View all order page
router.get("/orders", async (req, res) => {
  try {
    const order = await Order.find({}).populate('products.product_id').exec();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

//show specific order
router.get("/orders/:ordersId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.ordersId);
    if (!order) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
