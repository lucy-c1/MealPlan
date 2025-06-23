import {
  type RawRecipe,
  type Recipe,
  type RecipeIngredient,
} from "../types/type";

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

    return rawRecipeDataToRecipe(meal);
  });
}

function rawRecipeDataToRecipe(rawRecipe: RawRecipe): Recipe {
  const ingredients: RecipeIngredient[] = [];

  for (let i = 1; i <= 20; i++) {
    // @ts-expect-error: strIngredient does go from 1-20
    const ingredient = rawRecipe[`strIngredient${i}`];
    // @ts-expect-error: strIngredient does go from 1-20
    const quantity = rawRecipe[`strMeasure${i}`];

    if (ingredient && ingredient !== "") {
      ingredients.push({
        name: ingredient,
        amount: quantity || "", // fallback if measure is missing
      });
    }
  }

  const tagsArray = rawRecipe.strTags
    ?.split(",")
    .map((tag: string) => tag.trim()) // remove accidental spaces
    .filter((tag: string) => tag !== "");

  const recipe: Recipe = {
    id: rawRecipe.idMeal,
    name: rawRecipe.strMeal,
    area: rawRecipe.strArea,
    category: rawRecipe.strCategory,
    ingredients: ingredients,
    instructions: rawRecipe.strInstructions ?? "",
    imageUrl: rawRecipe.strMealThumb,
    tags: tagsArray ? tagsArray : [],
    ...(rawRecipe.strYoutube &&
      rawRecipe.strYoutube.trim() !== "" && {
        youtubeUrl: rawRecipe.strYoutube,
      }),
  };

  return recipe;
}

export async function getRecipesByName(name: string): Promise<Recipe[]> {
  const res = await fetch(
    `http://localhost:5000/api/search?q=${encodeURIComponent(name)}`
  );
  const data = await res.json();
  const recipes: RawRecipe[] = data.meals;
  return recipes?.map((recipe: RawRecipe) : Recipe => {
    return rawRecipeDataToRecipe(recipe)
  })?? [];
}

export async function getRecipesByCategories(categories: string[]): Promise<Recipe[]> {
  const results = await Promise.all(
    categories.map(async (category) => {
      const res = await fetch(
        `http://localhost:5000/api/search-category-details?q=${encodeURIComponent(category)}`
      );
      const data = await res.json();
      const rawRecipes: RawRecipe[] = data.meals || [];
      return rawRecipes.map((recipe : RawRecipe) => rawRecipeDataToRecipe(recipe));
    })
  );

  // Flatten array of arrays into one array of recipes
  return results.flat();
}

export async function getRecipesByAreas(areas: string[]): Promise<Recipe[]> {
  const results = await Promise.all(
    areas.map(async (area) => {
      const res = await fetch(
        `http://localhost:5000/api/search-area-details?q=${encodeURIComponent(area)}`
      );
      const data = await res.json();
      const rawRecipes: RawRecipe[] = data.meals || [];
      return rawRecipes.map((recipe : RawRecipe) => rawRecipeDataToRecipe(recipe));
    })
  );

  // Flatten array of arrays into one array of recipes
  return results.flat();
}

export default {
  getRecipe,
  getRandomRecipes,
  getRecipesByName,
  getRecipesByCategories,
  getRecipesByAreas,
};
