const express = require("express");
const Book = require("../../model/Book");

const router = express.Router();

router.post("/book", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json({
    success: true,
    message: "Book Added successfully",
  });
});

router.put("/book/:id", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json({
    success: true,
    message: "Book Added successfully",
  });
});

router.get("/book", async(req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
        const booksCount = books.length;
        res.status(200).json({
            success: true,
            data: books,
            booksCount: booksCount,
        });
      } catch (error) {
        res.status(500).json({ message: "Error in fetching Books", error });
      }
});

router.get("/book/:id", async(req, res) => {
    try {
        const book = await Book.findById(req.params.id); // Sort by createdAt in descending order
        res.status(200).json({
            success: true,
            data: book,
        });
      } catch (error) {
        res.status(500).json({ message: "Error in fetching Book", error });
      }
});


module.exports = router;
