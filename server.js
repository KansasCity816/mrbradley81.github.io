const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

// Add your existing POST `/add-blog` and other handlers here

// Fixing the regular expression replacement
app.post('/add-blog', (req, res) => {
    try {
        // Example of correct replacement usage
        const blogTemplate = fs.readFileSync(path.join(__dirname, 'blog-template.html'), 'utf-8');
        const blogContent = blogTemplate.replace(/{{title.replace(/\s+/g, '-').toLowerCase()}}/g, req.body.title.replace(/\s+/g, '-').toLowerCase());
        // Continue processing as needed...
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
