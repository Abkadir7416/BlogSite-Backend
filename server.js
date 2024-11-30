const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require("./routes/authRoutes");
const writerRoutes = require('./routes/writerRoutes')
const dotenv = require('dotenv')

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
console.log('url: ', process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.get('/', (req, res)=>{
  res.send("Welcome to BlogSite")
})
app.use("/api/auth", authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/writer', writerRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
