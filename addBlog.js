const fs = require("fs");
const path = "./blogs.json"; // Path to your JSON file

// Function to generate a slug from the blog title
function generateSlug(title) {
  return title.replace(/\s+/g, "-").toLowerCase();
}

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

    // Generate dynamic slug and URL for the new blog
    const slug = generateSlug(newBlog.title);
    newBlog.url = `https://lockchampionslocksmith.com/pages/Blog/${slug}.html`;

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
  category: "Lock Maintenance",
  author: "Admin",
  description: "Learn why changing your locks regularly ensures safety and security in your home or office."
};

// Call the function to add the blog
addBlog(newBlog);
