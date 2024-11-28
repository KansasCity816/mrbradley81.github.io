const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('.')); // Serve static files
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// Path to store blog files
const BLOG_DIRECTORY = path.join(__dirname, 'pages', 'Blog');

// Route to handle adding a blog post
app.post('/add-blog', (req, res) => {
    const { image, date, title, url, category, author, content } = req.body;

    const blogsFilePath = path.join(__dirname, 'blogs.json');
    const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));

    // Generate blog file name if `url` is not provided
    const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase(); // Sanitize title
    const blogFilename = url || `/pages/Blog/${sanitizedTitle}.html`;

    // Add the new blog entry to blogs.json
    const newBlogEntry = { image, date, title, url: blogFilename, category, author };
    blogsData.unshift(newBlogEntry);
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogsData, null, 2), 'utf-8');

    // Update blog-list.html
    const blogListPath = path.join(__dirname, 'blog-list.html');
    const blogListHTML = fs.readFileSync(blogListPath, 'utf-8');
    const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
    const newBlogHTML = `
      <!-- Blog -->
      <div class="blog-item">
        <div class="image">
          <img src="${image}" alt="Blog-Image"> <!-- Blog Image -->
          <div class="date"><span>${date.split(' ')[0]}</span> ${date.split(' ')[1]}</div> <!-- Blog Date -->
        </div>
        <div class="content">
          <a class="main-heading" href="${blogFilename}">${title}</a> <!-- Blog Title -->
          <div class="details">
            <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3> <!-- Blog Author -->
            <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3> <!-- Blog Category -->
          </div>
        </div>
      </div>
    `;
    const updatedBlogListHTML = blogListHTML.replace(insertionPoint, `${insertionPoint}\n${newBlogHTML}`);
    fs.writeFileSync(blogListPath, updatedBlogListHTML, 'utf-8');

    // Create a new blog post HTML file
    const blogFilePath = path.join(__dirname, blogFilename);
    const blogTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="../../assets/css/main.css">
        <link rel="stylesheet" href="../../assets/css/responsive.css">
      </head>
      <body>
        <div class="blog-post">
          <h1>${title}</h1>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Category:</strong> ${category}</p>
          <img src="${image}" alt="${title}">
          <div class="content">
            ${content}
          </div>
        </div>
      </body>
      </html>
    `;
    fs.writeFileSync(blogFilePath, blogTemplate, 'utf-8');

    res.status(201).json({ message: 'Blog post added successfully!', url: blogFilename });
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
