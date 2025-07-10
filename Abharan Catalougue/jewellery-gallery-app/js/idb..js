export async function initDB() {
  return await idb.openDB("jewelleryGallery", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("images")) {
        const store = db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
        store.createIndex("category", "category", { unique: false });
      }
    }
  });
}

export async function addImage(db, category, dataURL) {
  await db.add("images", { category, dataURL });
}

export async function getImages(db, category) {
  const tx = db.transaction("images", "readonly");
  const store = tx.objectStore("images");
  const index = store.index("category");
  return await index.getAll(category);
}

export async function deleteImageById(db, id) {
  await db.delete("images", id);
}

export async function getCategories(db) {
  const tx = db.transaction("images", "readonly");
  const store = tx.objectStore("images");
  const all = await store.getAll();

  const categories = [...new Set(all.map(img => img.category))];
  return categories;
}

export async function addCategoryToDB(db, category) {
  // just ensure the category exists, optional
  await addImage(db, category, "data:image/png;base64,"); // placeholder image
  await deleteImageById(db, (await getImages(db, category))[0].id); // remove it
}

export async function deleteCategoryFromDB(db, category) {
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");
  const index = store.index("category");
  const items = await index.getAll(category);
  for (const img of items) {
    await store.delete(img.id);
  }
}
