const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a new blog
app.post('/add-blog', (req, res) => {
    console.log('Incoming request:', req.body);

    const { image, date, title, category, author, content, description } = req.body;

    if (!image || !date || !title || !category || !author || !content || !description) {
        console.error('Validation failed:', req.body);
        return res.status(400).json({ error: 'All fields are required' });
    }

    const blogsFilePath = path.join(__dirname, 'blogs.json');
    const blogTemplatePath = path.join(__dirname, 'blog-template.html');
    const blogListPath = path.join(__dirname, 'blog-list.html');

    const blogSlug = title.replace(/\s+/g, '-').toLowerCase(); // Generate a slug for the blog
    const blogFilename = `/pages/Blog/${blogSlug}.html`;
    const blogFilePath = path.join(__dirname, blogFilename);

    try {
        // Format the date to display only the month and day
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
        });

        console.log('Updating blogs.json...');
        const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
        blogsData.unshift({ image, date: formattedDate, title, url: blogFilename, category, author });
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogsData, null, 2), 'utf-8');

        console.log('Updating blog-list.html...');
        const blogListHTML = fs.readFileSync(blogListPath, 'utf-8');
        const insertionPoint = '<!-- ===== Blogs (Start) ===== -->';
        const newBlogHTML = `
          <div class="blog-item">
            <div class="image">
              <img src="${image}" alt="Blog Image">
              <div class="date"><span>${formattedDate}</span></div>
            </div>
            <div class="content">
              <a class="main-heading" href="${blogFilename}">${title}</a>
			  <p class="blog-description">${description}</p>
              <div class="details">
                <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3>
                <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3>
              </div>
            </div>
          </div>
        `;
        const updatedBlogListHTML = blogListHTML.replace(insertionPoint, `${insertionPoint}\n${newBlogHTML}`);
        fs.writeFileSync(blogListPath, updatedBlogListHTML, 'utf-8');

        console.log('Creating new blog post...');
        const blogTemplate = fs.readFileSync(blogTemplatePath, 'utf-8');
        const blogContent = blogTemplate
  .replace(/{{title}}/g, title)
  .replace(/{{image}}/g, image)
  .replace(/{{date}}/g, formattedDate)
  .replace(/{{author}}/g, author)
  .replace(/{{category}}/g, category)
  .replace(/{{content}}/g, content)
  .replace(/{{url}}/g, `https://lockchampionslocksmith.com/pages/Blog/${blogSlug}.html`) // Uses the correct blog slug
  .replace(/{{description}}/g, description) // Uses the passed description field
  .replace(/{{title.replace\(\s\+\/g, '-'\).toLowerCase\(\)}}/g, blogSlug); // Correctly sets the slug.



        fs.writeFileSync(blogFilePath, blogContent, 'utf-8');

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
});
