import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/api";
import type { Recipe } from "../types/type";

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    initialize()
  }, []);

  async function initialize() {
    // get 6 random recipes
    const recipes = await api.getRandomRecipes()
    setRecipes(recipes)
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header isSearchPage={true} />

      <div className="flex w-full flex-1 min-h-0">
        {/* Filters section */}
        <div className="h-full flex flex-col w-[25%] py-8 px-4 border-r-2 border-orange-800 overflow-auto">
          <p className="text-base font-medium">Filters</p>
        </div>
        {/* Search Section */}
        <div className="w-[75%] flex flex-col px-12 py-8 overflow-auto">
          <p>Search</p>
          <div>{recipes.map((recipe) => {
            return (
              <div>
                <p>{recipe.id}</p>
                <p>{recipe.name}</p>
                <p>{recipe.area}</p>
                <p>{recipe.category}</p>
                <p>{recipe.instructions}</p>
              </div>
            )
          })}</div>
        </div>
      </div>
    </div>
  );
}
