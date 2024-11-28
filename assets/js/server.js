const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (e.g., blogs.json)
app.use(express.static(path.join(__dirname)));

// Route to serve the add-blog.html form
app.get('/add-blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'add-blog.html'));
});

// Route to handle adding a new blog
app.post('/add-blog', (req, res) => {
  const newBlog = req.body;

  fs.readFile('./blogs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file.');
      return;
    }

    const blogs = JSON.parse(data);
    blogs.push(newBlog);

    fs.writeFile('./blogs.json', JSON.stringify(blogs, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving file.');
        return;
      }

      res.status(200).send('Blog added successfully.');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
