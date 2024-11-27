const fs = require("fs");
const path = require("path");

const blogFolder = path.join(__dirname, "pages/Blog"); // Path to Blog-Single files
const blogListFile = path.join(blogFolder, "Blog-List.html"); // Path to Blog-List.html

const generateBlogList = () => {
  // Get all blog files from the blog folder
  const blogFiles = fs.readdirSync(blogFolder).filter(file => file.startsWith("Blog-Single") && file.endsWith(".html"));

  // Generate the list of blog items
  let blogItems = "";
  blogFiles.forEach((file, index) => {
    const filePath = path.join(blogFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Extract metadata (title)
    const titleMatch = fileContent.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : `Blog Post ${index + 1}`;

    // Use a default image pattern or generate dynamic image URLs
    const blogImage = `../../assets/images/Blog/Blogs/Blog-${index + 1}.jpg`;

    // Current date (use your own logic for publishing dates)
    const blogDate = new Date().toISOString().split("T"); // [YYYY-MM-DD, Time]
    const [year, month, day] = blogDate[0].split("-");
    const formattedDate = `<span>${day}</span> ${month}`;

    // Generate HTML for this blog item
    blogItems += `
      <div class="blog-item">
        <div class="image">
          <img src="${blogImage}" alt="Blog Image"> <!-- Blog Image -->
          <div class="date">${formattedDate}</div> <!-- Blog Date -->
        </div>
        <div class="content">
          <a class="main-heading" href="https://lockchampionslocksmith.com/pages/Blog/${file}">${title}</a> <!-- Blog Title -->
          <div class="details">
            <h3><i class="fa-solid fa-circle-user"></i><span>By Admin</span></h3> <!-- Blog Author -->
            <h3><i class="fa-solid fa-tags"></i><span>Category</span></h3> <!-- Blog Category -->
          </div>
        </div>
      </div>
    `;
  });

  // Read Blog-List.html and update the blog-container section
  const blogListHtml = fs.readFileSync(blogListFile, "utf8");
  const updatedHtml = blogListHtml.replace(
    /<div class="blog-container list">([\s\S]*?)<\/div>/,
    `<div class="blog-container list">${blogItems}</div>`
  );

  // Write the updated Blog-List.html
  fs.writeFileSync(blogListFile, updatedHtml, "utf8");
  console.log("Blog-List.html updated successfully!");
};

// Run the script
generateBlogList();
