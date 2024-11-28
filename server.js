const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Existing endpoint for adding a blog to blogs.json and blog-list.html
app.post('/add-blog', (req, res) => {
  const { title, date, author, category, image, content } = req.body;

  // Load existing blogs
  const blogsPath = path.join(__dirname, 'blogs.json');
  const blogListPath = path.join(__dirname, 'blog-list.html');

  fs.readFile(blogsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading blogs.json');
    }

    const blogs = JSON.parse(data);

    // Add the new blog to blogs.json
    const newBlog = { title, date, author, category, image, content };
    blogs.unshift(newBlog); // Add to the beginning of the array

    // Save updated blogs.json
    fs.writeFile(blogsPath, JSON.stringify(blogs, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing to blogs.json');
      }

      // Update blog-list.html
      fs.readFile(blogListPath, 'utf8', (err, htmlData) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading blog-list.html');
        }

        // Find the insertion point
        const insertionPoint = htmlData.indexOf('<!-- ===== Blogs (Start) ===== -->') + '<!-- ===== Blogs (Start) ===== -->'.length;

        // Build new blog HTML
        const newBlogHTML = `
        <!-- Blog -->
        <div class="blog-item">
          <div class="image">
            <img src="${image}" alt="${title}">
            <div class="date">${date}</div>
          </div>
          <div class="content">
            <a class="main-heading" href="#">${title}</a>
            <div class="details">
              <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3>
              <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3>
            </div>
          </div>
        </div>`;

        // Insert new blog HTML into blog-list.html
        const updatedHTML = htmlData.slice(0, insertionPoint) + newBlogHTML + htmlData.slice(insertionPoint);

        fs.writeFile(blogListPath, updatedHTML, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error updating blog-list.html');
          }

          res.send('Blog added successfully!');
        });
      });
    });
  });
});

// New endpoint to create a blog post file
app.post('/create-blog-post', (req, res) => {
  const { title, date, author, category, image, content } = req.body;

  // Construct the file name
  const fileName = title.toLowerCase().replace(/ /g, '-') + '.html';
  const filePath = path.join(__dirname, 'pages', 'Blog', fileName);

  // Template for the blog post
  const blogTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="../../assets/css/main.css">
  <link rel="stylesheet" href="../../assets/css/responsive.css">
</head>
<body>
  <header class="header">
    <!-- Add your header here -->
  </header>
  <section class="blog-single">
    <div class="blog-container">
      <div class="blog-info">
        <div class="image">
          <img src="${image}" alt="${title}">
          <div class="date">${date}</div>
        </div>
        <div class="content">
          <h1>${title}</h1>
          <h3>By ${author}</h3>
          <h4>Category: ${category}</h4>
          <p>${content}</p>
        </div>
      </div>
    </div>
  </section>
  <footer class="footer">
    <!-- Add your footer here -->
  </footer>
</body>
</html>
  `;

  // Write the file
  fs.writeFile(filePath, blogTemplate, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating blog post');
    }
    res.send('Blog post created successfully!');
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
