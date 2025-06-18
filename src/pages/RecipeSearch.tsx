import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/api";
import type { Recipe } from "../types/type";
import RecipeCard from "../components/RecipeCard";

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    // get 6 random recipes
    const recipes = await api.getRandomRecipes();
    setRecipes(recipes);
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
          <ul
            role="list"
            className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
          >
            {recipes.map((recipe) => {
              return <RecipeCard recipe={recipe} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
