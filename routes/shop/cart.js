const express = require("express");
const Book = require("../../model/Book");
const StudyTool = require("../../model/StudyTool");
const Cart = require("../../model/Cart");
const auth = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    // Check if a cart exists for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one with the product
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });

      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Cart created, and item added successfully!",
      });
    }

    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Product is already in the cart
      return res.status(200).json({
        success: true,
        message: "Item already exists in the cart.",
      });
    }

    // Add the new product to the cart
    cart.items.push({ productId, quantity: 1 });

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to the cart successfully!",
    });
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

router.put("/", auth, async (req, res) => {
  const { productId, action } = req.body; // action can be "increment" or "decrement"
  const userId = req.user.id;
  if (!productId || !["increment", "decrement"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Product ID and valid action ('increment' or 'decrement') are required.",
    });
  }
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user.",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex < 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in the cart.",
      });
    }

    // Update quantity based on the action
    const item = cart.items[itemIndex];
    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return res.status(201).json({
          success: true,
          message: "Quantity cannot be less than 1.",
          item
        });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: `Item quantity ${action}ed successfully!`,
      cart,
    });
  } catch (error) {
    console.error("Error updating item quantity:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const productId = req.params.id; // Product ID to remove
  const userId = req.user.id; // User ID from middleware

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.status(200).json({
      success: true,
      message: `${Cart.name} Item removed from cart`,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const userid = req.user.id;
    const cart = await Cart.findOne({ userId: userid });
    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const book = await Book.findById(item.productId);
        const studytool = await StudyTool.findById(item.productId);
        const productData = book ? book : studytool;
        return {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          quantity: item.quantity,
          image: productData.image,
          author: productData.author,
          seller: productData.seller,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: updatedItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
