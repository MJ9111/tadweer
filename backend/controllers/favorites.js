const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Favorite = require('../models/favorite'); 


router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find or create the favorite document for the user
    let favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      favorite = new Favorite({ userId, products: [] });
    }

    // Check if the product is already in the favorites
    const productExists = favorite.products.some(product => product.product_id.toString() === productId);
    if (productExists) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    // Add the product to the favorites
    favorite.products.push({ product_id: productId });
    await favorite.save();

    res.status(201).json({ message: 'Added to favorites successfully', favorite });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//show all favorites

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId }).populate('products.product_id');

    res.status(200).json({ favorites });
  } catch (error) {
    console.error('Error showing favorites:', error); 
    res.status(500).json({ error: 'Internal server error' });
  }
});

//delete favorite

router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { product_id } = req.body;

    // Find the favorite document for the given userId
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    // Find the index of the product in the favorites
    const productIndex = favorite.products.findIndex(product => product.product_id.toString() === product_id.toString());
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in favorites' });
    }

    // Remove the product from the favorites
    favorite.products.splice(productIndex, 1);
    await favorite.save();

    res.status(200).json({ message: 'Product removed from favorites successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;