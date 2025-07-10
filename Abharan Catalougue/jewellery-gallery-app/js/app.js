document.addEventListener("DOMContentLoaded", function () {
  // Redirect to login page if not logged in
  if (!localStorage.getItem("role")) {
    window.location.href = "login.html";
    return;
  }

  const isAdmin = localStorage.getItem("role") === "admin";
  let categories = JSON.parse(localStorage.getItem("categories")) || [
    { name: "diamond" },
    { name: "gold" }
  ];

  const categoryGrid = document.getElementById("categoryGrid");
  const adminTools = document.getElementById("adminTools");
  const scrollContainer = document.querySelector(".container");
  const bottomNav = document.getElementById("bottomNav");

  // Render categories
  function showCategories() {
    if (!categoryGrid) return;

    categoryGrid.innerHTML = "";
    const galleryData = JSON.parse(localStorage.getItem("galleryData")) || {};

    categories.forEach((cat, index) => {
      const card = document.createElement("div");
      card.className = "category-card";
      card.innerText = cat.name;

      const images = galleryData[cat.name] || [];
      if (images.length > 0) {
        card.style.backgroundImage = `url(${images[0]})`;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
        card.style.color = "white";
        card.style.textShadow = "1px 1px 3px black";
        card.style.justifyContent = "flex-end";
        card.style.padding = "10px";
      }

      card.onclick = () => {
        window.location.href = `gallery.html?category=${encodeURIComponent(cat.name)}`;
      };

      if (isAdmin) {
        const delBtn = document.createElement("button");
        delBtn.innerText = "🗑 Delete";
        delBtn.className = "delete-category-btn";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Delete category "${cat.name}" and its images?`)) {
            deleteCategory(index, cat.name);
          }
        };
        card.appendChild(delBtn);
      }

      categoryGrid.appendChild(card);
    });
  }

  // Show admin panel if admin
  if (isAdmin && adminTools) {
    adminTools.style.display = "block";
  }

  // Add category
  window.addCategory = function () {
    const nameInput = document.getElementById("newCategoryName");
    const imgInput = document.getElementById("newCategoryImage");

    const name = nameInput.value.trim().toLowerCase();
    const file = imgInput.files[0];

    if (!name || categories.some(c => c.name === name)) {
      alert("Invalid or duplicate category name");
      return;
    }

    if (!file) {
      alert("Please select a preview image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      categories.push({ name });

      const galleryData = JSON.parse(localStorage.getItem("galleryData")) || {};
      galleryData[name] = [e.target.result];

      localStorage.setItem("categories", JSON.stringify(categories));
      localStorage.setItem("galleryData", JSON.stringify(galleryData));

      nameInput.value = "";
      imgInput.value = "";
      showCategories();
    };
    reader.readAsDataURL(file);
  };

  // Delete category
  window.deleteCategory = function (index, name) {
    categories.splice(index, 1);
    const galleryData = JSON.parse(localStorage.getItem("galleryData")) || {};
    delete galleryData[name];

    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("galleryData", JSON.stringify(galleryData));
    showCategories();
  };

  // Logout function
  window.logout = function () {
    localStorage.removeItem("role");
    window.location.href = "login.html";
  };

  // Toggle menu
  window.toggleMenu = function () {
    const menu = document.getElementById("sideMenu");
    if (menu) menu.classList.toggle("open");
  };

  // Close side menu if clicked outside
  document.addEventListener("click", function (e) {
    const menu = document.getElementById("sideMenu");
    const menuBtn = document.querySelector(".menu-btn");
    if (menu && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove("open");
    }
  });

  // Initial render
  showCategories();
});
