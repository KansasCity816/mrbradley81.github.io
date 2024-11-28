const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from the root directory

// Paths
const blogsFile = path.join(__dirname, 'blogs.json');
const blogListFile = path.join(__dirname, 'blog-list.html');

app.post('/add-blog', (req, res) => {
  const { image, date, title, url, category, author } = req.body;

  // 1. Update blogs.json
  const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf-8'));
  blogs.push({ image, date, title, url, category, author });
  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));

  // 2. Create the HTML snippet for the new blog
  const blogHtml = `
    <div class="blog-item">
      <div class="image">
        <img src="${image}" alt="Blog-Image">
        <div class="date"><span>${date.split(' ')[0]}</span> ${date.split(' ')[1]}</div>
      </div>
      <div class="content">
        <a class="main-heading" href="${url}">${title}</a>
        <div class="details">
          <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3>
          <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3>
        </div>
      </div>
    </div>
  `;

  // 3. Read blog-list.html and locate the injection point
  let blogListHtml = fs.readFileSync(blogListFile, 'utf-8');

  // Find the position of the end marker
  const marker = '<!-- ===== Blogs (End) ===== -->';
  const markerIndex = blogListHtml.indexOf(marker);

  if (markerIndex === -1) {
    res.status(500).send('Error: Blog list template is missing the end marker.');
    return;
  }

  // Insert the new blog HTML before the end marker
  blogListHtml =
    blogListHtml.slice(0, markerIndex) +
    blogHtml +
    '\n' +
    blogListHtml.slice(markerIndex);

  // 4. Write the updated HTML back to blog-list.html
  fs.writeFileSync(blogListFile, blogListHtml);

  res.status(200).send('Blog added successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
