const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "Gallery";
const title = document.getElementById("categoryTitle");
const isAdmin = localStorage.getItem("role") === "admin";
title.innerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;

const uploadSection = document.getElementById("uploadSection");
const imageGrid = document.getElementById("imageGrid");

if (isAdmin) {
  uploadSection.style.display = "block";
}

let galleryData = JSON.parse(localStorage.getItem("galleryData")) || {};
if (!galleryData[category]) galleryData[category] = [];

let currentIndex = 0;

function displayImages() {
  imageGrid.innerHTML = "";

  galleryData[category].forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "category-card";

    const image = document.createElement("img");
    image.src = img;
    image.className = "thumbnail";
    image.style.width = "100%";
    image.style.borderRadius = "10px";
    image.onclick = () => openFullScreen(index);
    card.appendChild(image);

    if (isAdmin) {
      const controls = document.createElement("div");
      controls.style.display = "flex";
      controls.style.justifyContent = "center";
      controls.style.gap = "10px";
      controls.style.marginTop = "8px";

      const editBtn = document.createElement("button");
      editBtn.innerText = "✍️ Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => {
        window.location.href = `editor.html?category=${encodeURIComponent(category)}&index=${index}`;
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "🗑️ Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteImage(index);

      controls.appendChild(editBtn);
      controls.appendChild(deleteBtn);
      card.appendChild(controls);
    }

    imageGrid.appendChild(card);
  });
}

window.uploadImages = function () {
  const input = document.getElementById("imageUpload");
  const files = Array.from(input.files);

  if (files.length + galleryData[category].length > 100) {
    alert("You can upload up to 100 images per category.");
    return;
  }

  const promises = files.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(promises).then(results => {
    galleryData[category] = galleryData[category].concat(results);
    localStorage.setItem("galleryData", JSON.stringify(galleryData));
    input.value = "";
    displayImages();
  }).catch(err => {
    alert("Failed to upload image(s).");
    console.error(err);
  });
};

function deleteImage(index) {
  if (!confirm("Are you sure you want to delete this image?")) return;
  galleryData[category].splice(index, 1);
  localStorage.setItem("galleryData", JSON.stringify(galleryData));
  displayImages();
}

function goBack() {
  window.location.href = "index.html";
}

function openFullScreen(index) {
  currentIndex = index;
  const viewer = document.createElement("div");
  viewer.className = "fullscreen-viewer";
  viewer.innerHTML = `
    <div class="fullscreen-inner">
      <img id="fullscreenImage" src="${galleryData[category][index]}" />
      <button class="nav-btn prev" onclick="prevImage()">←</button>
      <button class="nav-btn next" onclick="nextImage()">→</button>
      <button class="nav-btn close" onclick="closeFullScreen()">✖</button>
      <a class="nav-btn download" href="${galleryData[category][index]}" download="image.jpg">⬇</a>
    </div>
  `;
  document.body.appendChild(viewer);
}

window.closeFullScreen = function () {
  const viewer = document.querySelector(".fullscreen-viewer");
  if (viewer) viewer.remove();
};

window.nextImage = function () {
  currentIndex = (currentIndex + 1) % galleryData[category].length;
  updateFullScreenImage();
};

window.prevImage = function () {
  currentIndex = (currentIndex - 1 + galleryData[category].length) % galleryData[category].length;
  updateFullScreenImage();
};

function updateFullScreenImage() {
  document.getElementById("fullscreenImage").src = galleryData[category][currentIndex];
  document.querySelector(".download").href = galleryData[category][currentIndex];
}

displayImages();
