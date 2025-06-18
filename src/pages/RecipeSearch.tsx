import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/api";
import type { Recipe } from "../types/type";
import RecipeCard from "../components/RecipeCard";

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    // get 6 random recipes
    getRecipes();
  }

  // get 6 random recipes
  async function getRecipes() {
    setIsLoading(true);
    const recipes = await api.getRandomRecipes();
    setRecipes((prevRecipes) => [...prevRecipes, ...recipes]);
    setIsLoading(false);
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
          {/* Grid of recipes */}
          <div
            role="list"
            className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
          >
            {recipes.map((recipe) => {
              return <RecipeCard recipe={recipe} />;
            })}
          </div>
          {/* Load more button */}
          <div className="w-full flex justify-center mt-3">
            <button
              onClick={getRecipes}
              className="cursor-pointer text-center w-24 rounded-md bg-orange-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Loading..." : "Load more"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
