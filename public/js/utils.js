import { recipeData, displayCards, increaseCardDisplayCount } from './ui.js';

export function setupSearch() {
  document.getElementById("search").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    recipeData.forEach(data => {
      const visible = data.title.toLowerCase().includes(value);
      data.element.classList.toggle("hide", !visible);
    });
  });
}

export function setupLoadMore() {
  const btn = document.getElementById("loadMoreButton");

  btn.addEventListener("click", () => {
    increaseCardDisplayCount();
    displayCards();

    if (recipeData.length <= document.querySelectorAll(".card:not(.hide)").length) {
      btn.style.display = "none";
    }
  });
}
