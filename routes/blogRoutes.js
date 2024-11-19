const express = require('express');
const Blog = require('../model/Blog.js');
const Users = require("../model/Users.js");
const auth = require("../middleware/authMiddleware");
const nodemailer =  require('nodemailer');
require("dotenv").config();
const router = express.Router();

//sending and receiving email functionalliy
router.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;
  const senderEmail = email;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email to Admin
  const adminMailOptions = {
    from: senderEmail,
    to: process.env.ADMIN_EMAIL,
    subject: "BlogSite: Contact Form Submission",
    text: `Name: ${name}\nEmail: ${senderEmail}\nMessage: ${message}`,
  };

  // Confirmation Email to User
  const userMailOptions = {
    from:"BlogSite:" + process.env.SMTP_USER,
    to: senderEmail,
    subject: "We’ve Received Your Message!",
    text: `Hello ${name},\n\nThank you for reaching out! We've received your message:"\n\nWe will get back to you shortly.\n\nBest regards,\n[BlogSite]`,
  };
  try {
    await transporter.sendMail(adminMailOptions); // Send email to admin
    await transporter.sendMail(userMailOptions); // Send confirmation email to user

    res.status(200).json({ message: "Your details have been received. Check your email for confirmation!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to process your request", error });
  }
  
});


// Create a new blog post
router.post('/', auth, async (req, res) => {
  try {
    const { writer, title, description, imgSrc } = req.body;
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


router.get('/home', auth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 3; // Default to 3 if limit is not provided

  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(limit); // Sort by createdAt in descending order
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
});


// Route to get all blogs, sorted with the latest blog at the top: (/api/blogs)
router.get('/', auth, async (req, res) => {
  try {
      const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by descending order of creation date
      res.json(blogs);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching blogs' });
  }
});


// Search route for filtering blogs by title or content
router.get("/search", auth, async (req, res) => {
  const query = req.query.query; // The search term
  try {
//     // Use regex to find blogs with a title or description containing the search term (case insensitive)
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });
    res.json(blogs); // Return the filtered blogs
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Error fetching blogs" });
  }

});

// Get a single blog post by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error });
  }
});


// Update a blog post by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error });
  }
});


// Delete a blog post by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error });
  }
});


// Like a blog post
router.put("/like/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const user = await Users.findById(req.user.id);

    if (!blog) return res.status(404).json({ msg: "Blog post not found" });

    // Check if user already liked the post
    if (blog.likedBy.includes(req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    blog.likes++;
    blog.likedBy.push(req.user.id);
    await blog.save();

    user.likedPosts.push(blog._id);
    await user.save();

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Unlike a blog post
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const user = await Users.findById(req.user.id);

    if (!blog) return res.status(404).json({ msg: "Blog post not found" });

    // Check if user has not liked the post
    if (!blog.likedBy.includes(req.user.id)) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }

    blog.likes--;
    blog.likedBy = blog.likedBy.filter((id) => id.toString() !== req.user.id);
    await blog.save();

    user.likedPosts = user.likedPosts.filter((postId) => postId.toString() !== blog._id.toString());
    await user.save();

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ===========================


router.post("/comments/:id", async (req, res) => {
  console.log('id: ', req.params.id);
  try {
    const { commentText } = req.body;
    const blog = await Blog.findById(req.params.id);
    console.log(commentText);
    // console.log(blog);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }
    const newComment = {
      commentText,
      // commentBy: req.user.id, // Get the user ID from the JWT middleware
    };

    blog.comments.push(newComment); // Add the new comment to the array
    await blog.save();

    res.status(200).json(blog.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
