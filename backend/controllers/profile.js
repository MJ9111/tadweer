// controllers/profiles.js
const express = require("express");

const router = express.Router();
const User = require("../models/user");
const Address = require("../models/address");
const isOwner = require("../middleware/is-owner");

router.get("/:userId", isOwner, async (req, res) => {
  try {
    // if (req.user.id !== req.params.userId) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }

    res.json({ user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });

    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }

    res.status(201).json(user);
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { user_id, street, city, state, zip } = req.body;

    const address = await Address.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    );

    if (!user_id) {
      return res.status(400).json({ error: "Some element required" });
    }

    res.status(201).json(address);
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
