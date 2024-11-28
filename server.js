const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/add-blog', (req, res) => {
    const { image, date, title, url, category, author, content } = req.body;

    // File paths
    const blogsFilePath = path.join(__dirname, 'blogs.json');
    const blogTemplatePath = path.join(__dirname, 'blog-template.html');
    const blogListPath = path.join(__dirname, 'blog-list.html');

    // Generate blog file name if `url` is not provided
    const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase(); // Sanitize title
    const blogFilename = url || `/pages/Blog/${sanitizedTitle}.html`;
    const blogFilePath = path.join(__dirname, blogFilename);

    // Step 1: Update blogs.json
    const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
    const newBlogEntry = { image, date, title, url: blogFilename, category, author };
    blogsData.unshift(newBlogEntry);
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogsData, null, 2), 'utf-8');

    // Step 2: Update blog-list.html
    const blogListHTML = fs.readFileSync(blogListPath, 'utf-8');
    const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
    const newBlogHTML = `
      <!-- Blog -->
      <div class="blog-item">
        <div class="image">
          <img src="${image}" alt="Blog-Image">
          <div class="date"><span>${date.split(' ')[0]}</span> ${date.split(' ')[1]}</div>
        </div>
        <div class="content">
          <a class="main-heading" href="${blogFilename}">${title}</a>
          <div class="details">
            <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3>
            <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3>
          </div>
        </div>
      </div>
    `;
    const updatedBlogListHTML = blogListHTML.replace(insertionPoint, `${insertionPoint}\n${newBlogHTML}`);
    fs.writeFileSync(blogListPath, updatedBlogListHTML, 'utf-8');

    // Step 3: Create a new blog post file using the template
    const blogTemplate = fs.readFileSync(blogTemplatePath, 'utf-8');
    const blogContent = blogTemplate
        .replace(/{{title}}/g, title)
        .replace(/{{image}}/g, image)
        .replace(/{{date}}/g, date)
        .replace(/{{author}}/g, author)
        .replace(/{{category}}/g, category)
        .replace(/{{content}}/g, content);

    fs.writeFileSync(blogFilePath, blogContent, 'utf-8');

    res.status(201).json({ message: 'Blog post added successfully!', url: blogFilename });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
