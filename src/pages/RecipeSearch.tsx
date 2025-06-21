import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/api";
import type { Recipe } from "../types/type";
import RecipeCard from "../components/RecipeCard";

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nameSearchValue, setNameSearchValue] = useState<string>("");

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    // get 6 random recipes
    getRecipes();
  }

  console.log(recipes);

  // get 6 random recipes
  async function getRecipes() {
    setIsLoading(true);
    const recipes = await api.getRandomRecipes();
    setRecipes((prevRecipes) => [...prevRecipes, ...(recipes || [])]);
    setIsLoading(false);
  }

  async function handleNameSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const data = await api.getRecipesByName(nameSearchValue);
    setRecipes(data);
    setIsLoading(false);
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header isSearchPage={true} />

      <div className="flex w-full flex-1 min-h-0">
        {/* Filters section */}
        <div className="h-full flex flex-col w-[25%] py-8 px-4 border-r-2 border-orange-800 overflow-auto gap-4">
          <form
            className="sm:flex sm:max-w-md"
            onSubmit={(e) => handleNameSearchSubmit(e)}
          >
            <label htmlFor="name-search" className="sr-only">
              Email address
            </label>
            <input
              id="name-search"
              name="name-search"
              type="text"
              required
              placeholder="Search recipe by name"
              value={nameSearchValue}
              onChange={(e) => setNameSearchValue(e.target.value)}
              className="w-full min-w-0 rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-700 sm:w-64 sm:text-base/6 xl:w-full"
            />
            <div className="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md cursor-pointer bg-orange-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
              >
                Search Recipe
              </button>
            </div>
          </form>
          <p className="text-base font-medium">Filters</p>
        </div>
        {/* Search Section */}
        <div className="w-[75%] flex flex-col px-12 py-8 overflow-auto">
          {/* Grid of recipes */}
          <div
            role="list"
            className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
          >
            {recipes.length != 0
              ? recipes.map((recipe) => {
                  return <RecipeCard recipe={recipe} />;
                })
              : !isLoading && <p>No recipes found</p>}
          </div>
          {/* Load more button */}
          <div className="w-full flex justify-center mt-5">
            <button
              onClick={getRecipes}
              className="cursor-pointer text-center rounded-md bg-orange-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Loading..." : "Load Random Recipes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
