import { type Recipe, type RecipeIngredient } from "../types/type";

const API_URL = "http://localhost:5000/";

function _urlFor(path: string) {
  return API_URL + path;
}

/**
 * Gets a random single recipe.
 */
async function getRecipe() {
  const url = _urlFor("get-recipe");
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}

/**
 * Fetches 6 random recipes.
 *
 * @returns A promise that resolves to an array of `Recipe` objects.
 */
export async function getRandomRecipes(): Promise<Recipe[]> {
  const promises = Array.from({ length: 6 }, () => getRecipe());
  const rawResults = await Promise.all(promises);

  return rawResults.map((mealData) => {
    const meal = mealData.meals[0];

    const ingredients: RecipeIngredient[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const quantity = meal[`strMeasure${i}`];

      if (ingredient && ingredient !== "") {
        ingredients.push({
          name: ingredient,
          amount: quantity || "", // fallback if measure is missing
        });
      }
    }

    const tagsArray = meal.strTags
      ?.split(",")
      .map((tag: string) => tag.trim()) // remove accidental spaces
      .filter((tag: string) => tag !== "");

    const recipe: Recipe = {
      id: meal.idMeal,
      name: meal.strMeal,
      area: meal.strArea,
      category: meal.strCategory,
      ingredients: ingredients,
      instructions: meal.strInstructions,
      imageUrl: meal.strMealThumb,
      tags: tagsArray ? tagsArray : [],
      ...(meal.strYoutube &&
        meal.strYoutube.trim() !== "" && {
          youtubeUrl: meal.strYoutube,
        }),
    };

    return recipe;
  });
}

export default {
  getRecipe,
  getRandomRecipes,
};
