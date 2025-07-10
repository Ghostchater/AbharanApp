// js/index.js
import { initDB, getCategories, addCategoryToDB, deleteCategoryFromDB } from './idb.js';

document.addEventListener("DOMContentLoaded", async () => {
  const isAdmin = localStorage.getItem("role") === "admin";
  const adminTools = document.getElementById("adminTools");
  const categoryGrid = document.getElementById("categoryGrid");
  const db = await initDB();

  if (isAdmin) adminTools.style.display = "block";

  async function renderCategories() {
    categoryGrid.innerHTML = "";
    const categories = await getCategories(db);

    categories.forEach(cat => {
      const div = document.createElement("div");
      div.className = "category-card";
      div.innerText = cat;
      div.onclick = () => {
        window.location.href = `gallery.html?category=${encodeURIComponent(cat)}`;
      };
      categoryGrid.appendChild(div);
    });
  }

  window.addCategory = async () => {
    const input = document.getElementById("newCategoryName");
    const name = input.value.trim();
    if (!name) return alert("Enter a valid name");
    await addCategoryToDB(db, name);
    input.value = "";
    renderCategories();
  };

  window.logout = () => {
    localStorage.removeItem("role");
    location.href = "login.html";
  };

  window.toggleMenu = () => {
    document.getElementById("sideMenu").classList.toggle("open");
  };

  renderCategories();
});
