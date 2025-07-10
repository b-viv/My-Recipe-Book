export async function getAllRecipes() {
    const res = await fetch('/recipes');
    return await res.json();
  }
  
  export async function postRecipe(formData) {
    return await fetch('/recipes', {
      method: 'POST',
      body: formData,
    });
  }
  
  export async function deleteRecipeById(id) {
    return await fetch(`/recipes/${id}`, {
      method: 'DELETE',
    });
  }
  
  export async function updateRecipe(id, formData) {
    console.log("api:", id);
    return await fetch(`/recipes/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }
  