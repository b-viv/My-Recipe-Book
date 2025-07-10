import { createRecipes } from './ui.js';
import { fillEditForm, addRecipe, editRecipe } from './handlers.js';
import { deleteRecipeById } from './api.js';

export function handleCardClick(card, recipe) {
  const modal = document.querySelector(".modal-recipe");
  const modalContent = document.querySelector(".modal-recipe-content");
  const cardContainer = document.querySelector(".card");
  const searchBar = document.querySelector(".search-bar");

  card.addEventListener("click", () => {
    modal.classList.remove("hide");
    cardContainer.classList.add("hide");
    document.querySelector('.addRecipe-btn-container').classList.add("hide");
    searchBar.classList.add("hide");
    document.querySelector('.cards').classList.add("hide");
    document.querySelector('.pagerButtonContainer').classList.add("hide");

    modalContent.innerHTML = `
      <button type="button" class="modal-close-btn">
        <span class="material-symbols-outlined">close</span>
      </button>
      <h3 class="modal-recipe-title">${recipe.title}</h3>
      <div class="modal-recipe-img">
        <img src="${recipe.image}" alt="${recipe.title}">
      </div>
      <div class="modal-recipe-ingredients">
        <p>Ingredients</p><pre>${recipe.ingredients}</pre>
      </div>
      <div class="modal-recipe-instructions">
        <p>Instructions</p><pre>${recipe.description}</pre>
      </div>
      <div class="modal-recipe-Btns">
        <button type="button" class="editBtn"><span class="material-symbols-outlined">edit</span>Edit</button>
        <button type="button" class="deleteBtn"><span class="material-symbols-outlined">delete</span>Delete</button>
      </div>
    `;

    modal.querySelector(".modal-close-btn").addEventListener("click", () => {
      modal.classList.add("hide");
      cardContainer.classList.remove("hide");
      document.querySelector('.addRecipe-btn-container').classList.remove("hide");
      searchBar.classList.remove("hide");
      document.querySelector('.cards').classList.remove("hide");
      document.querySelector('.pagerButtonContainer').classList.remove("hide");
    });

    modal.querySelector(".editBtn").addEventListener("click", () => {
      document.querySelector(".modal-recipe-content").classList.add("hide");
      document.querySelector(".edit-recipe-form-container").classList.remove("hide");
      console.log(recipe);
      fillEditForm(recipe);
    });

    modal.querySelector(".deleteBtn").addEventListener("click", async (e) => {
      e.preventDefault();
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        await deleteRecipeById(recipe._id);
        modal.classList.add("hide");
        cardContainer.classList.remove("hide");
        document.querySelector('.addRecipe-btn-container').classList.remove("hide");
        searchBar.classList.remove("hide");
        document.querySelector('.cards').classList.remove("hide");
        document.querySelector('.pagerButtonContainer').classList.remove("hide");
        createRecipes();
      }
    });
  });
}

export function setupEventListeners() {
  document.getElementById("addRecipeBtn").addEventListener("click", () => {
    document.querySelector('.add-recipe-container').classList.remove("hide");
    document.querySelector('.cards').classList.add("hide");
    document.querySelector('.search-bar').classList.add("hide");
    document.querySelector('.addRecipe-btn-container').classList.add("hide");
  });

  document.querySelector('.add-recipe-close-btn').addEventListener("click", () => {
    document.querySelector('.add-recipe-container').classList.add("hide");
    document.querySelector('.cards').classList.remove("hide");
    document.querySelector('.search-bar').classList.remove("hide");
    document.querySelector('.addRecipe-btn-container').classList.remove("hide");
  });

  document.getElementById("editRecipeImage").addEventListener("change", function () {
    const file = this.files[0];
   
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("editImagePreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const addImagePreview = document.getElementById("addImagePreview");
  addImagePreview.classList.add("hide");

  document.getElementById("recipeImage").addEventListener("change", function () {
    const file = this.files[0];
   
    if (file) {
      addImagePreview.classList.remove("hide");
      const reader = new FileReader();
      reader.onload = function (e) {
        addImagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("addRecipeForm").addEventListener("submit", addRecipe);
  document.getElementById("editRecipeForm").addEventListener("submit", editRecipe);
}
