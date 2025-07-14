import { getAllRecipes } from './api.js';
import { handleCardClick } from './events.js';

export let recipeData = [];
let currentDisplayIndex = 30;

export async function createRecipes() {
  try {
    const data = await getAllRecipes();
    const cardContainer = document.querySelector(".cards");
    cardContainer.innerHTML = "";
    recipeData = [];

    data.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("card", "hide");

      const shortTitle = recipe.title.length > 21
        ? recipe.title.slice(0, 53) + "..."
        : recipe.title;

      const recipeContainer = document.createElement("div");
      recipeContainer.classList.add("recipe-container");
      recipeContainer.innerHTML = `
        <input type="hidden" name="id" id="recipeId" value="${recipe._id}">
        <h3>${shortTitle}</h3>
        <div class="recipe-image">
            <img class="recipe-image" src="${recipe.image}" alt="${recipe.title} image" loading="lazy" onerror="this.onerror=null; this.src='./assets/img/no_image.jpg';">
        </div>
      `;
      card.appendChild(recipeContainer);
      cardContainer.appendChild(card);

      handleCardClick(card, recipe); 

      recipeData.push({ id: recipe._id, title: recipe.title, description: recipe.description, ingredients: recipe.ingredients, element: card });
    });

    displayCards();
  } catch (err) {
    console.error("Error loading data: ", err);
  }
}

export function displayCards() {
  recipeData.forEach((data, index) => {
    if (index < currentDisplayIndex) {
      data.element.classList.remove("hide");
    }
  });
}

export function increaseCardDisplayCount(byAmount = 15) {
  currentDisplayIndex += byAmount;
}
