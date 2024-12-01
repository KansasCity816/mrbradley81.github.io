const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths
const BLOGS_DIR = path.join(__dirname, 'pages', 'Blog');
const BLOG_LIST_FILE = path.join(__dirname, 'blog-list.html');
const blogsFilePath = path.join(__dirname, 'blogs.json');
const blogTemplatePath = path.join(__dirname, 'blog-template.html');

// Function to update blog-list.html when a new blog is added
function addBlogToList(blogFilename, title, image, formattedDate, author, category) {
    console.log('Updating blog-list.html...');
    const blogListHTML = fs.readFileSync(BLOG_LIST_FILE, 'utf-8');
    const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
    const newBlogHTML = `
      <div class="blog-item">
        <div class="image">
          <img src="${image}" alt="Blog Image">
          <div class="date"><span>${formattedDate}</span></div>
        </div>
        <div class="content">
          <a class="main-heading" href="/pages/Blog/${blogFilename}">${title}</a>
          <div class="details">
            <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3>
            <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3>
          </div>
        </div>
      </div>`;
    const updatedBlogListHTML = blogListHTML.replace(
        insertionPoint,
        `${insertionPoint}\n${newBlogHTML}`
    );
    fs.writeFileSync(BLOG_LIST_FILE, updatedBlogListHTML, 'utf-8');
    console.log('Blog list updated successfully!');
}

// Add a new blog through the POST endpoint
app.post('/add-blog', (req, res) => {
    console.log('Incoming request:', req.body);

    const { image, date, title, category, author, content } = req.body;

    if (!image || !date || !title || !category || !author || !content) {
        console.error('Validation failed:', req.body);
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
    const blogFilename = `${sanitizedTitle}.html`;
    const blogFilePath = path.join(BLOGS_DIR, blogFilename);

    try {
        // Format the date
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short', // e.g., "Nov"
            day: '2-digit', // e.g., "29"
        });

        console.log('Creating new blog post...');
        const blogTemplate = fs.readFileSync(blogTemplatePath, 'utf-8');
        const blogContent = blogTemplate
            .replace(/{{title}}/g, title)
            .replace(/{{image}}/g, image)
            .replace(/{{date}}/g, formattedDate)
            .replace(/{{author}}/g, author)
            .replace(/{{category}}/g, category)
            .replace(/{{content}}/g, content);
        fs.writeFileSync(blogFilePath, blogContent, 'utf-8');
        console.log(`New blog created at: ${blogFilePath}`);

        // Update blogs.json
        console.log('Updating blogs.json...');
        const blogsData = fs.existsSync(blogsFilePath)
            ? JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'))
            : [];
        blogsData.unshift({ image, date: formattedDate, title, url: blogFilename, category, author });
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogsData, null, 2), 'utf-8');

        // Update blog list
        addBlogToList(blogFilename, title, image, formattedDate, author, category);

        res.status(201).json({ message: 'Blog added successfully!', url: `/pages/Blog/${blogFilename}` });
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
});

// Watch for new files in the /pages/Blog directory
fs.watch(BLOGS_DIR, (eventType, filename) => {
    if (eventType === 'rename' && filename.endsWith('.html')) {
        const blogFilePath = path.join(BLOGS_DIR, filename);
        if (fs.existsSync(blogFilePath)) {
            console.log(`New blog detected: ${filename}`);
            const blogContent = fs.readFileSync(blogFilePath, 'utf-8');

            // Extract metadata from the new blog file
            const titleMatch = blogContent.match(/<title>(.*?)<\/title>/);
            const title = titleMatch ? titleMatch[1] : 'Untitled Blog';

            const imageMatch = blogContent.match(/<img src="(.*?)"/);
            const image = imageMatch ? imageMatch[1] : '/assets/images/default-blog.jpg';

            const dateMatch = blogContent.match(/<meta name="date" content="(.*?)"/);
            const date = dateMatch
                ? new Date(dateMatch[1]).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
                : 'Unknown Date';

            const authorMatch = blogContent.match(/<meta name="author" content="(.*?)"/);
            const author = authorMatch ? authorMatch[1] : 'Unknown Author';

            const categoryMatch = blogContent.match(/<meta name="category" content="(.*?)"/);
            const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';

            // Add to blog-list.html
            addBlogToList(filename, title, image, date, author, category);
        }
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
