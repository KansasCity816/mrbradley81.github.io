// Function to fetch blogs from the JSON file
async function fetchBlogs() {
  try {
    // Adjust the path to your blogs.json file
    const response = await fetch("../../assets/data/blogs.json");

    // Throw an error if the response is not ok
    if (!response.ok) throw new Error("Failed to fetch blog data");

    // Parse the JSON data
    const blogData = await response.json();

    // Dynamically add blogs to the page
    addBlogs(blogData);
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

// Function to add blogs to the blog container
function addBlogs(blogData) {
  // Select the blog container
  const blogContainer = document.querySelector(".blog-container.list");

  // Loop through each blog entry in the JSON data
  blogData.forEach((blog) => {
    // Check if the blog already exists to prevent duplicates
    const existingBlog = Array.from(blogContainer.children).some(
      (item) =>
        item.querySelector("a.main-heading")?.textContent.trim() === blog.title
    );

    // If the blog doesn't already exist, add it to the container
    if (!existingBlog) {
      const blogHTML = `
        <div class="blog-item">
          <div class="image">
            <img src="${blog.image}" alt="Blog-Image">
            <div class="date"><span>${blog.date.split(" ")[0]}</span> ${
        blog.date.split(" ")[1]
      }</div>
          </div>
          <div class="content">
            <a class="main-heading" href="${blog.url}">${blog.title}</a>
            <div class="details">
              <h3><i class="fa-solid fa-circle-user"></i><span>By ${
                blog.author
              }</span></h3>
              <h3><i class="fa-solid fa-tags"></i><span>${
                blog.category
              }</span></h3>
            </div>
          </div>
        </div>
      `;

      // Append the new blog HTML to the blog container
      blogContainer.insertAdjacentHTML("beforeend", blogHTML);
    }
  });
}

// Call fetchBlogs to load blogs dynamically
fetchBlogs();
