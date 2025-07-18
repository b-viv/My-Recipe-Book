import { postRecipe, updateRecipe } from './api.js';
import { createRecipes } from './ui.js';

export async function addRecipe(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  formData.set("title", capitalize(formData.get("title")));

  const response = await postRecipe(formData);
  
  if (response.ok) {
    form.reset();
    document.querySelector(".add-recipe-container").classList.add("hide");
    document.querySelector(".cards").classList.remove("hide");
    document.querySelector(".search-bar").classList.remove("hide");
    document.querySelector(".addRecipe-btn-container").classList.remove("hide");
    createRecipes();
  } else {
    console.error("Error adding recipe");
  }
}

export async function editRecipe(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const id = document.getElementById('editId').value;
  const res = await updateRecipe(id, formData);

  if (res.ok) {
    form.reset();
    document.querySelector(".cards").classList.add('hide');
    document.querySelector(".edit-recipe-form-container").classList.add("hide");
    document.querySelector(".modal-recipe-content").classList.remove("hide");
    formData.set("title", capitalize(formData.get("title")));
    createRecipes();
  } else {
    console.error("Error while modifying");
  }
}

export function fillEditForm(recipe) {
  document.getElementById("editId").value = recipe._id;
  document.getElementById("editTitle").value = recipe.title || "";
  document.getElementById("editImagePreview").src = recipe.image;
  document.getElementById("editIngredients").value = recipe.ingredients || "";
  document.getElementById("editDescription").value = recipe.description || "";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
