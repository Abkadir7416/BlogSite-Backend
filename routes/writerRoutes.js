const express = require("express");
const writer = require("../model/writer.js");
const Blog = require("../model/Blog.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, degree, description, postCount, imgSrc } = req.body;
    
    // Check if a writer with the same name already exists
    const existingWriter = await writer.findOne({ name });
    if (existingWriter) {
      return res.status(400).json({
        success: false,
        message: "Writer with this name already exists",
      });
    }
    
   
      
    // Create a new writer
    const newWriter = new writer({
      name,
      degree,
      description,
      postCount,
      imgSrc,
    });

    const blogs = await Blog.find({ writer:name });
    if (blogs.length > 0) {
      newWriter.postCount = blogs.length;
      }


    await newWriter.save();
    res.status(201).json({
      success: true,
      message: "Writer added successfully",
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
    res.status(200).json({
      success: true,
      data: writers,
    });
  } catch(error) {
    res.status(500).json({ message: "Error in fetching writer's details", error });
  }
});


router.get('/blogs/:name', async (req, res) => {
  const writerName = req.params.name;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  try {
    const blogs = await Blog.find({ writer: writerName }).skip(skip).limit(limit);
    const totalBlogCount = await Blog.find({ writer: writerName }).countDocuments();
    if (blogs.length === 0) {
    return res.status(200).json({
      totalBlogCount: 0,
      message: `No blogs found for writer: ${writerName}`,
    });
    }

    res.status(200).json({ totalBlogCount, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "An error occurred while fetching blogs", error });
  }

});

module.exports = router;
