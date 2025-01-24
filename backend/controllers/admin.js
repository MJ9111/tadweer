const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order')
router.get('/', (req, res) => {
    res.send('admin')
  }
  )

// prodects


// show all product:

router.get('/showAllProduct', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error showing products:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)


// show one product:

router.get('/showProduct/:id', async (req, res) => { 
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error showing product:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)

// create Product:

router.post('/createProduct', async (req, res) => {
  try {
    const { name, price, description, category, stock, ratings, imageP, imageS, imageT, imageF} = req.body;

    const newProduct = new Product({ name, price, description, category, stock, ratings, imageP, imageS, imageT, imageF });
    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// update Product:

router.put('/updateProduct/:id', async (req, res) => {
  try {
    const { name, price, description, category, stock, ratings, imageP, imageS, imageT, imageF } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, stock, ratings, imageP, imageS, imageT, imageF },
      { new: true }
    );
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// delete Product:

router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
});






// orders //

// get all orders:
router.get('/showAllOrders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error showing orders:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)
// show one orders:
router.get('/showOrder/:id', async (req, res) => {  
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error showing order:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)
// update orders:

router.put('/updateOrder/:id', async (req, res) => {
  try {
    const { status, totalPrice, products } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, totalPrice, products },
      { new: true }
    );
    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)

// users

// get all user:

router.get('/showAllUser', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error showing users:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)

// show one user:

router.get('/showUser/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error showing user:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)

// update user:

router.put('/updateUser/:id', async (req, res) => {
  try {
    const { username, email, firstName, lastName, phoneNumber, isAdmin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, firstName, lastName, phoneNumber, isAdmin },
      { new: true }
    );
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)

// delete user:user

router.delete('/deleteUser/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error); // Log the error details
    res.status(500).json({ error: 'Internal server error' });
  }
}
)



// cuntact_us

// get all cuntact_us:
// show one cuntact_us:



module.exports = router;