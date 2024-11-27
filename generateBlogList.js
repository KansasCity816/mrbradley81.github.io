const fs = require('fs');
const path = require('path');

// Define paths
const blogFolder = path.join(__dirname, 'pages/Blog'); // Location of Blog-Single files
const blogListFile = path.join(blogFolder, 'Blog-List.html'); // Path to Blog-List.html

const generateBlogList = () => {
  // Get all blog files in the Blog folder
  const blogFiles = fs.readdirSync(blogFolder).filter(file => file.startsWith('Blog-Single') && file.endsWith('.html'));

  // Generate the blog items
  let blogItems = '';
  blogFiles.forEach((file, index) => {
    const blogTitle = file.replace('Blog-Single', 'Blog Post ').replace('.html', ''); // Derive title
    const blogDate = new Date().toISOString().split('T')[0]; // Example: Current date
    const blogUrl = `https://lockchampionslocksmith.com/pages/Blog/${file}`;

    blogItems += `
      <div class="blog-item">
        <div class="image">
          <img src="../../assets/images/Blog/Blogs/Blog-${index + 1}.jpg" alt="Blog Image"> <!-- Blog Image -->
          <div class="date"><span>${blogDate.split('-')[2]}</span> ${blogDate.split('-')[1]}</div> <!-- Blog Date -->
        </div>
        <div class="content">
          <a class="main-heading" href="${blogUrl}">${blogTitle}</a> <!-- Blog Title -->
          <div class="details">
            <h3><i class="fa-solid fa-circle-user"></i><span>By Admin</span></h3> <!-- Blog Author -->
            <h3><i class="fa-solid fa-tags"></i><span>Category</span></h3> <!-- Placeholder Category -->
          </div>
        </div>
      </div>
    `;
  });

  // Read Blog-List.html and replace the blog-container content
  const blogListHtml = fs.readFileSync(blogListFile, 'utf8');
  const updatedHtml = blogListHtml.replace(
    /<div class="blog-container list">([\s\S]*?)<\/div>/,
    `<div class="blog-container list">${blogItems}</div>`
  );

  // Write the updated HTML back to the Blog-List.html file
  fs.writeFileSync(blogListFile, updatedHtml);
  console.log('Blog-List.html updated successfully!');
};

// Run the script
generateBlogList();
