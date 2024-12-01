const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path definitions
const blogsDirectory = path.join(__dirname, 'pages', 'Blog');
const blogListPath = path.join(__dirname, 'blog-list.html');

// Utility function to rebuild blog-list.html
function updateBlogList() {
    try {
        console.log('Rebuilding blog-list.html...');

        // Read all blog files in the blogs directory
        const blogFiles = fs.readdirSync(blogsDirectory).filter(file => file.endsWith('.html'));

        const blogEntries = blogFiles.map(file => {
            const filePath = path.join(blogsDirectory, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Extract metadata from the blog file (title, image, date, etc.)
            const titleMatch = content.match(/<h1>(.*?)<\/h1>/); // Example: Extract title from <h1>
            const imageMatch = content.match(/<img src="(.*?)" alt="/); // Extract image src
            const dateMatch = content.match(/<span class="date">(.*?)<\/span>/); // Extract date
            const authorMatch = content.match(/<span>By (.*?)<\/span>/); // Extract author

            return {
                url: `/pages/Blog/${file}`,
                title: titleMatch ? titleMatch[1] : 'Untitled',
                image: imageMatch ? imageMatch[1] : '/assets/images/default.png',
                date: dateMatch ? dateMatch[1] : 'Unknown Date',
                author: authorMatch ? authorMatch[1] : 'Unknown Author',
            };
        });

        // Generate the updated blog list HTML
        const blogsHTML = blogEntries.map(blog => `
          <div class="blog-item">
            <div class="image">
              <img src="${blog.image}" alt="${blog.title}">
              <div class="date"><span>${blog.date}</span></div>
            </div>
            <div class="content">
              <a class="main-heading" href="${blog.url}">${blog.title}</a>
              <div class="details">
                <h3><i class="fa-solid fa-circle-user"></i><span>By ${blog.author}</span></h3>
              </div>
            </div>
          </div>
        `).join('\n');

        // Insert into blog-list.html
        const blogListTemplate = fs.readFileSync(blogListPath, 'utf-8');
        const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
        const updatedBlogListHTML = blogListTemplate.replace(
            new RegExp(`${insertionPoint}[\\s\\S]*?<!-- ===== Blogs (End) ===== -->`, 'g'),
            `${insertionPoint}\n${blogsHTML}\n<!-- ===== Blogs (End) ===== -->`
        );

        fs.writeFileSync(blogListPath, updatedBlogListHTML, 'utf-8');
        console.log('blog-list.html updated successfully!');
    } catch (error) {
        console.error('Error updating blog list:', error);
    }
}

// Watch the blogs directory for changes
fs.watch(blogsDirectory, (eventType, filename) => {
    if (eventType === 'rename' && filename.endsWith('.html')) {
        console.log(`Detected change in ${filename}. Rebuilding blog list...`);
        updateBlogList();
    }
});

// Add a new blog
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
        // Format the date to display only the month and day
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
        });

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

        console.log('Updating blogs.json...');
        const blogsFilePath = path.join(__dirname, 'blogs.json');
        const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
        blogsData.unshift({ image, date: formattedDate, title, url: blogFilename, category, author });
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogsData, null, 2), 'utf-8');

        // Update blog-list.html
        updateBlogList();

        console.log('Blog added successfully!');
        res.status(201).json({ message: 'Blog added successfully!', url: blogFilename });
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    updateBlogList(); // Initial build of blog-list.html
});
