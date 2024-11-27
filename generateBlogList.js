const fs = require("fs");
const path = require("path");

const blogListPath = path.join(__dirname, "pages/Blog/Blog-List.html"); // Path to Blog-List.html
const blogData = [
  {
    image: "../../assets/images/Blog/Blogs/Blog-5.jpg",
    date: "26 Nov",
    title: "5 Tips to Upgrade Your Home Security",
    url: "../../pages/Blog/Blog-Single-5.html",
    category: "Home Security",
    author: "Admin",
  },
  {
    image: "../../assets/images/Blog/Blogs/Blog-6.jpg",
    date: "20 Nov",
    title: "How to Choose a Reliable Locksmith",
    url: "../../pages/Blog/Blog-Single-6.html",
    category: "Locksmith Services",
    author: "Admin",
  },
];

// Generate HTML for a single blog
const generateBlogHTML = ({ image, date, title, url, category, author }, index) => {
  const [day, month] = date.split(" ");
  return `
    <!-- Blog-${index + 5} -->
    <div class="blog-item">
      <div class="image">
        <img src="${image}" alt="Blog-Image"> <!-- Blog Image -->
        <div class="date"><span>${day}</span> ${month}</div> <!-- Blog Date -->
      </div>
      <div class="content">
        <a class="main-heading" href="${url}">${title}</a> <!-- Blog Title -->
        <div class="details">
          <h3><i class="fa-solid fa-circle-user"></i><span>By ${author}</span></h3> <!-- Blog Author -->
          <h3><i class="fa-solid fa-tags"></i><span>${category}</span></h3> <!-- Blog Category -->
        </div>
      </div>
    </div>`;
};

// Append new blogs to the blog list section
const appendBlogsToHTML = () => {
  try {
    // Read the existing Blog-List.html file
    const blogListContent = fs.readFileSync(blogListPath, "utf8");

    // Generate HTML for new blogs
    const newBlogsHTML = blogData.map((data, index) => generateBlogHTML(data, index)).join("\n");

    // Find the insertion point
    const insertionPoint = blogListContent.indexOf("<!-- ===== Blogs (End) ===== -->");

    if (insertionPoint === -1) {
      throw new Error("Cannot find the blog insertion point.");
    }

    // Insert new blogs before the closing comment
    const updatedBlogListContent =
      blogListContent.slice(0, insertionPoint) +
      newBlogsHTML +
      "\n" +
      blogListContent.slice(insertionPoint);

    // Write the updated content back to Blog-List.html
    fs.writeFileSync(blogListPath, updatedBlogListContent, "utf8");
    console.log("Blogs successfully appended to Blog-List.html!");
  } catch (error) {
    console.error("Error appending blogs:", error.message);
  }
};

// Run the script
appendBlogsToHTML();
