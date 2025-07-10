import { initDB, addImage, getImages, updateImage, deleteImageById } from './idb.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("category") || "Gallery";
  const isAdmin = localStorage.getItem("role") === "admin";
  const uploadSection = document.getElementById("uploadSection");
  const grid = document.getElementById("imageGrid");
  document.getElementById("categoryTitle").innerText = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Collection`;

  const db = await initDB();

  if (isAdmin) uploadSection.style.display = "block";

  async function displayImages() {
    grid.innerHTML = "";
    const items = await getImages(db, cat);

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "category-card";

      const img = document.createElement("img");
      img.src = item.dataURL;
      img.onclick = () => window.location.href = `editor.html?category=${encodeURIComponent(cat)}&id=${item.id}`;
      card.appendChild(img);

      if (isAdmin) {
        const edit = document.createElement("button");
        edit.innerText = "✍️ Edit";
        edit.className = "edit-btn";
        edit.onclick = () => window.location.href = `editor.html?category=${encodeURIComponent(cat)}&id=${item.id}`;
        card.appendChild(edit);

        const del = document.createElement("button");
        del.innerText = "🗑 Delete";
        del.className = "delete-btn";
        del.onclick = async () => {
          if (confirm("Delete this image?")) {
            await deleteImageById(db, cat, item.id);
            displayImages();
          }
        };
        card.appendChild(del);
      }

      grid.appendChild(card);
    });
  }

  window.uploadImages = async () => {
    const files = Array.from(document.getElementById("imageUpload").files);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async e => {
        await addImage(db, cat, e.target.result);
        displayImages();
      };
      reader.readAsDataURL(file);
    }
  };

  window.goBack = () => window.location.href = "index.html";
  window.logout = () => {
    localStorage.removeItem("role");
    window.location.href = "login.html";
  };

  // Initial display
  displayImages();
});
