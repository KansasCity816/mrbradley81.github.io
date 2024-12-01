const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Paths
const BLOG_DIR = path.join(__dirname, 'pages', 'Blog'); // Blog posts directory
const BLOG_LIST = path.join(__dirname, 'blog-list.html'); // Blog list file

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Function to rebuild the blog list
function rebuildBlogList() {
    const blogEntries = [];

    // Read all files in the blog directory
    fs.readdir(BLOG_DIR, (err, files) => {
        if (err) {
            console.error('Error reading blog directory:', err);
            return;
        }

        // Process each blog file
        files.forEach((file) => {
            if (file.endsWith('.html')) {
                const filePath = path.join(BLOG_DIR, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');

                // Extract metadata (title, description)
                const titleMatch = fileContent.match(/<title>(.*?)<\/title>/);
                const title = titleMatch ? titleMatch[1] : 'Untitled Blog';

                const descriptionMatch = fileContent.match(/<meta name="description" content="(.*?)"/);
                const description = descriptionMatch ? descriptionMatch[1] : 'No description available.';

                // Default image (if no image is found)
                const imageMatch = fileContent.match(/<img src="(.*?)"/);
                const image = imageMatch
                    ? imageMatch[1]
                    : 'https://lockchampionslocksmith.com/assets/images/default-blog.jpg';

                // Add blog entry
                blogEntries.push({ title, description, image, file });
            }
        });

        // Generate the blog list HTML
        const blogListContent = `
          <div class="blog-list">
            ${blogEntries
                .map(
                    (entry) => `
                <div class="blog-item">
                  <a href="/pages/Blog/${entry.file}">
                    <img src="${entry.image}" alt="${entry.title}">
                    <h3>${entry.title}</h3>
                    <p>${entry.description}</p>
                  </a>
                </div>
              `
                )
                .join('\n')}
          </div>
        `;

        // Write to the blog-list.html file
        fs.writeFileSync(BLOG_LIST, blogListContent, 'utf-8');
        console.log('Blog list updated successfully!');
    });
}

// Route to rebuild blog list manually
app.get('/rebuild-blog-list', (req, res) => {
    rebuildBlogList();
    res.send('Blog list rebuilt successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Rebuild blog list on server start
    rebuildBlogList();
});
