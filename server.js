const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blogsFilePath = path.join(__dirname, 'blogs.json');
const blogListPath = path.join(__dirname, 'blog-list.html');
const blogDirectory = path.join(__dirname, 'pages/Blog');

// Function to update blog-list.html with all blogs in the directory
function updateBlogList() {
    console.log('Updating blog-list.html with all blogs in /pages/Blog/');
    try {
        const blogFiles = fs.readdirSync(blogDirectory);

        // Read existing blogs.json
        const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));

        // Generate new blog-list content
        const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
        const blogListHTML = fs.readFileSync(blogListPath, 'utf-8');
        let blogsHTML = '';

        blogsData.forEach(blog => {
            blogsHTML += `
            <div class="blog-item">
                <div class="image">
                    <img src="${blog.image}" alt="Blog-Image">
                    <div class="date"><span>${blog.date}</span></div>
                </div>
                <div class="content">
                    <a class="main-heading" href="${blog.url}">${blog.title}</a>
                    <div class="details">
                        <h3><i class="fa-solid fa-circle-user"></i><span>By ${blog.author}</span></h3>
                        <h3><i class="fa-solid fa-tags"></i><span>${blog.category}</span></h3>
                    </div>
                </div>
            </div>`;
        });

        const updatedBlogListHTML = blogListHTML.replace(
            new RegExp(`${insertionPoint}[\\s\\S]*?<!-- ===== Blogs (End) ===== -->`),
            `${insertionPoint}\n${blogsHTML}\n<!-- ===== Blogs (End) ===== -->`
        );

        fs.writeFileSync(blogListPath, updatedBlogListHTML, 'utf-8');
        console.log('blog-list.html updated successfully!');
    } catch (error) {
        console.error('Error updating blog list:', error);
    }
}

// Add a new blog via POST request
app.post('/add-blog', (req, res) => {
    console.log('Incoming request:', req.body);

    const { image, date, title, category, author, content } = req.body;

    if (!image || !date || !title || !category || !author || !content) {
        console.error('Validation failed:', req.body);
        return res.status(400).json({ error: 'All fields are required' });
    }

    const blogFilename = `/pages/Blog/${title.replace(/\s+/g, '-').toLowerCase()}.html`;
    const blogFilePath = path.join(__dirname, blogFilename);

    try {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short', // e.g., "Nov"
            day: '2-digit', // e.g., "29"
        });

        console.log('Updating blogs.json...');
        const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
        blogsData.unshift({ image, date: formattedDate, title, url: blogFilename, category, author });
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogsData, null, 2), 'utf-8');

        console.log('Creating new blog post...');
        const blogTemplatePath = path.join(__dirname, 'blog-template.html');
        const blogTemplate = fs.readFileSync(blogTemplatePath, 'utf-8');
        const blogContent = blogTemplate
            .replace(/{{title}}/g, title)
            .replace(/{{image}}/g, image)
            .replace(/{{date}}/g, formattedDate)
            .replace(/{{author}}/g, author)
            .replace(/{{category}}/g, category)
            .replace(/{{content}}/g, content);
        fs.writeFileSync(blogFilePath, blogContent, 'utf-8');

        console.log('Updating blog list...');
        updateBlogList();

        console.log('Blog added successfully!');
        res.status(201).json({ message: 'Blog added successfully!', url: blogFilename });
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
});

// Monitor the /pages/Blog/ directory for new files
fs.watch(blogDirectory, (eventType, filename) => {
    if (eventType === 'rename' && filename) {
        console.log(`File change detected in /pages/Blog/: ${filename}`);
        updateBlogList();
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
