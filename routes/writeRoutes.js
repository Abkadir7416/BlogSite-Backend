const express = require("express");
const writer = require("../model/writer.js");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { name, degree, description, postCount, imgSrc } = req.body;
    const newWriter = new writer({
      name,
      degree,
      description,
      postCount,
      imgSrc,
    });
    await newWriter.save();
    res.status(201).json({
      success: true,
      message: "Writter added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating writer profile", error });
  }
});

router.get("/", async(req, res) => {
    const limit = parseInt(req.query.limit) || 4;
  try {
    const writers = await writer.find().limit(limit);
    res.status(200).json({
      success: true,
      data: writers,
    });
  } catch(error) {
    res.status(500).json({ message: "Error fetching writers", error });
  }
});


router.get("/:id", async(req, res) => {
  try {
    const writers = await writer.findById(req.params.id);
    console.log('writtter: ', writers);
    res.status(200).json({
      success: true,
      data: writers,
    });
  } catch(error) {
    res.status(500).json({ message: "Error in fetching writer's details", error });
  }
});

module.exports = router;
