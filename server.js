const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Route to handle adding new blogs
app.post("/add-blog", (req, res) => {
  const newBlog = req.body;

  // Read the current blogs.json file
  fs.readFile(path.join(__dirname, "blogs.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading blogs.json:", err);
      res.status(500).send("Server Error");
      return;
    }

    // Parse the JSON file and add the new blog
    const blogs = JSON.parse(data);
    blogs.push(newBlog);

    // Write updated blogs back to blogs.json
    fs.writeFile(
      path.join(__dirname, "blogs.json"),
      JSON.stringify(blogs, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to blogs.json:", err);
          res.status(500).send("Server Error");
          return;
        }

        // Update blog-list.html
        updateBlogListHTML(blogs);

        res.redirect("/blog-list.html");
      }
    );
  });
});

// Function to update blog-list.html
function updateBlogListHTML(blogs) {
  const blogHTML = blogs
    .map((blog, index) => {
      return `
        <!-- Blog-${index + 1} -->
        <div class="blog-item">
          <div class="image">
            <img src="${blog.image}" alt="Blog-Image">
            <div class="date"><span>${blog.date.split(" ")[0]}</span> ${
        blog.date.split(" ")[1]
      }</div>
          </div>
          <div class="content">
            <a class="main-heading" href="${blog.url}">${blog.title}</a>
            <div class="details">
              <h3><i class="fa-solid fa-circle-user"></i><span>By ${
                blog.author
              }</span></h3>
              <h3><i class="fa-solid fa-tags"></i><span>${blog.category}</span></h3>
            </div>
          </div>
        </div>`;
    })
    .join("");

  const blogListHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blog List</title>
      <link rel="stylesheet" href="assets/css/main.css">
      <link rel="stylesheet" href="assets/css/responsive.css">
    </head>
    <body>
      <div class="blog-container list">
        ${blogHTML}
      </div>
    </body>
    </html>
  `;

  fs.writeFile(path.join(__dirname, "blog-list.html"), blogListHTML, (err) => {
    if (err) {
      console.error("Error updating blog-list.html:", err);
    }
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
