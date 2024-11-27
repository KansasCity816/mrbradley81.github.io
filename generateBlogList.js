const fs = require('fs');
const path = require('path');

const blogFolder = './pages/Blog'; // Folder containing Blog-Single files
const outputFile = './pages/Blog/Blog-List.html'; // File to update

const generateBlogList = () => {
  const blogFiles = fs.readdirSync(blogFolder).filter(file => file.endsWith('.html'));

  let blogListHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Blog List</title>
  </head>
  <body>
    <h1>Our Blog</h1>
    <ul>
  `;

  blogFiles.forEach(file => {
    const title = file.replace(/-/g, ' ').replace('.html', ''); // Use file name as title
    blogListHtml += `<li><a href="./pages/Blog/${file}">${title}</a></li>`;
  });

  blogListHtml += `
    </ul>
  </body>
  </html>
  `;

  fs.writeFileSync(outputFile, blogListHtml);
  console.log('Blog-List.html updated successfully!');
};

generateBlogList();
