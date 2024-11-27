const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json()); // For parsing JSON requests

const path = "./blogs.json"; // Path to the JSON file

// Endpoint to add a new blog
app.post("/add-blog", (req, res) => {
  const newBlog = req.body; // Get the new blog from the request body

  // Read the existing blogs
  fs.readFile(path, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading the file.");

    const blogs = JSON.parse(data); // Parse the JSON
    blogs.push(newBlog); // Add the new blog

    // Write the updated JSON back to the file
    fs.writeFile(path, JSON.stringify(blogs, null, 2), "utf8", (err) => {
      if (err) return res.status(500).send("Error writing to the file.");
      res.status(200).send("Blog added successfully!");
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
