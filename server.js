const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to serve static files and parse JSON requests
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define paths
const BLOGS_DIR = path.join(__dirname, 'pages', 'Blog');
const BLOG_LIST_FILE = path.join(__dirname, 'blog-list.html');
const BLOG_TEMPLATE_FILE = path.join(__dirname, 'blog-template.html');

// Endpoint to add a new blog
app.post('/add-blog', (req, res) => {
    console.log('Incoming request:', req.body);

    const { image, date, title, category, author, content } = req.body;

    // Validation
    if (!image || !date || !title || !category || !author || !content) {
        console.error('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Format file paths and metadata
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
    });
    const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
    const blogFilename = `${sanitizedTitle}.html`;
    const blogFilePath = path.join(BLOGS_DIR, blogFilename);

    try {
        // Create the new blog post from the template
        console.log('Creating new blog post...');
        const blogTemplate = fs.readFileSync(BLOG_TEMPLATE_FILE, 'utf-8');
        const blogContent = blogTemplate
            .replace(/{{title}}/g, title)
            .replace(/{{image}}/g, image)
            .replace(/{{date}}/g, formattedDate)
            .replace(/{{author}}/g, author)
            .replace(/{{category}}/g, category)
            .replace(/{{content}}/g, content);
        fs.writeFileSync(blogFilePath, blogContent, 'utf-8');

        // Update the blog list
        console.log('Updating blog list...');
        const blogListHTML = fs.readFileSync(BLOG_LIST_FILE, 'utf-8');
        const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
        const newBlogEntry = `
          <div class="blog-item">
            <div class="image">
              <img src="${image}" alt="Blog Image">
              <div class="date"><span>${formattedDate}</span></div>
            </div>
            <div class="content">
              <a class="main-heading" href="/pages/Blog/${blogFilename}">${title}</a>
              <div class="details">
                <h3><i class="fa-solid fa-circle-user"></i> By ${author}</h3>
                <h3><i class="fa-solid fa-tags"></i> ${category}</h3>
              </div>
            </div>
          </div>
        `;
        const updatedBlogListHTML = blogListHTML.replace(
            insertionPoint,
            `${insertionPoint}\n${newBlogEntry}`
        );
        fs.writeFileSync(BLOG_LIST_FILE, updatedBlogListHTML, 'utf-8');

        console.log('Blog added successfully!');
        res.status(201).json({ message: 'Blog added successfully!', url: `/pages/Blog/${blogFilename}` });
    } catch (error) {
        console.error('Error processing blog:', error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
