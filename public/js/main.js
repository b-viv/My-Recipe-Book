import { createRecipes } from './ui.js';
import { setupEventListeners } from './events.js';
import { setupSearch, setupLoadMore } from './utils.js';

window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".loader").classList.add("hide");
  }, 3000);
  
  createRecipes();
  setupEventListeners();
  setupSearch();
  setupLoadMore();
});
