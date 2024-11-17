const express = require('express');

const router = express.Router();


router.post('/', async (req, res) => {
    try {
      const { author, title, description, imgSrc } = req.body;
      const newBlog = new Blog({ writer, title, description, imgSrc });
      await newBlog.save();
      res.status(201).json({
        success: true, 
        message: 'Blog created successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating blog post', error });
    }
  });
  

router.get('/', async (req, res) => {
    try {
      const { author, title, description, imgSrc } = req.body;
      const newBlog = new Blog({ writer, title, description, imgSrc });
      await newBlog.save();
      res.status(201).json({
        success: true, 
        message: 'Blog created successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating blog post', error });
    }
  });
  






module.exports = router;
