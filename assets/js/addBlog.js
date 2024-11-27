const fs = require("fs");
const path = "./blogs.json"; // Path to your JSON file

// Function to add a new blog
function addBlog(newBlog) {
  // Read the existing JSON file
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Parse the JSON data
    const blogs = JSON.parse(data);

    // Add the new blog
    blogs.push(newBlog);

    // Write the updated JSON back to the file
    fs.writeFile(path, JSON.stringify(blogs, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return;
      }
      console.log("Blog added successfully!");
    });
  });
}

// Example blog data
const newBlog = {
  image: "../../assets/images/Blog/Blogs/Blog-7.jpg",
  date: "30 Nov",
  title: "Why You Should Regularly Change Your Locks",
  url: "../../pages/Blog/Blog-Single-7.html",
  category: "Lock Maintenance",
  author: "Admin"
};

// Call the function to add the blog
addBlog(newBlog);
