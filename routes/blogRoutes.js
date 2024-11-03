const express = require('express');
const Blog = require('../model/Blog.js');
const Users = require("../model/Users.js");
const auth = require("../middleware/authMiddleware");
const nodemailer =  require('nodemailer');

const router = express.Router();

// ================= Functions =================== 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdulquadir8701@gmail.com',
    pass: 'wzqt scni nugk qmub', // Your app-specific password
  },
});


// Define the email endpoint
router.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message)
  console.log('mail api is called.')
  const mailOptions = {
    from: 'abdulquadir8701@gmail.com',
    to: email,
    subject: `Message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('error in sending mail')
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

// ------------------------------
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


module.exports = router;
