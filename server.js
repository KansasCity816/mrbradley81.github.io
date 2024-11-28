const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle blog addition
app.post("/add-blog", (req, res) => {
  const { image, date, title, url, category, author } = req.body;

  // New blog HTML template
  const newBlogHtml = `
        <div class="blog-item">
          <div class="image">
            <img src="${image}" alt="Blog-Image">
            <div class="date"><span>${date.split(" ")[0]}</span> ${date.split(" ")[1]}</div>
          </div>
          <div class="content">
            <a class="main-heading" href="${url}">${title}</a>
            <div class="details">
              <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3>
              <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3>
            </div>
          </div>
        </div>
  `;

  // Path to the blog-list.html file
  const blogListPath = path.join(__dirname, "blog-list.html");

  // Read the existing blog-list.html file
  fs.readFile(blogListPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading blog-list.html:", err);
      return res.status(500).send("Error reading blog-list.html");
    }

    // Find the insertion point after <!-- ===== Blogs (Start) ===== -->
    const startMarker = "<!-- ===== Blogs (Start) ===== -->";
    const startIndex = data.indexOf(startMarker);
    if (startIndex === -1) {
      return res.status(500).send("Start marker not found in blog-list.html");
    }

    // Insert the new blog entry right after the start marker
    const beforeStart = data.substring(0, startIndex + startMarker.length);
    const afterStart = data.substring(startIndex + startMarker.length);
    const updatedHtml = `${beforeStart}\n${newBlogHtml}\n${afterStart}`;

    // Write the updated HTML back to blog-list.html
    fs.writeFile(blogListPath, updatedHtml, "utf8", (err) => {
      if (err) {
        console.error("Error writing to blog-list.html:", err);
        return res.status(500).send("Error writing to blog-list.html");
      }
      res.send("Blog added successfully!");
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
