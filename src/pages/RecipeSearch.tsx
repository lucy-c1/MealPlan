import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/api";
import { areas, categories, type Recipe } from "../types/type";
import RecipeCard from "../components/RecipeCard";
import { ChevronDown, Search, Filter } from "lucide-react";
import { getUserRecipes } from "@/RecipeDB/recipeDB";
import { useAuth } from "@/AuthContext";

function FilterSection({
  name,
  filters,
  selectedFilters,
  setSelectedFilters,
}: {
  name: string;
  filters: string[];
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCheckboxChange = (filter: string, checked: boolean) => {
    setSelectedFilters((prev) =>
      checked ? [...prev, filter] : prev.filter((f) => f !== filter)
    );
  };

  return (
    <div className="space-y-4">
      <div
        className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-500" />
          Filter by {name}
        </p>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-3 pl-3">
          {filters.map((filter) => {
            const isChecked = selectedFilters.includes(filter);
            return (
              <div key={filter} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="flex h-5 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      id={filter}
                      name={filter}
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(filter, e.target.checked)
                      }
                      className="cursor-pointer col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-blue-500 checked:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center stroke-white"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-checked:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-sm">
                  <label
                    htmlFor={filter}
                    className="text-gray-700 cursor-pointer font-medium"
                  >
                    {filter}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RecipeSearch() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nameSearchValue, setNameSearchValue] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  console.log(selectedCategories);
  console.log(selectedAreas);

  useEffect(() => {
    if (user?.uid) {
      initialize();
    }
  }, [user]);

  async function initialize() {
    setIsLoading(true);

    // fetch 6 random recipes (your existing API call)
    await getRecipes();

    // fetch user saved recipes from Firestore
    if (user) {
      const saved = await getUserRecipes(user.uid);
      setUserRecipes(saved);
    }

    setIsLoading(false);
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

  async function applyFilters() {
    setIsLoading(true);
    setRecipes([]);
    const data = await api.getRecipesByCategoryAndArea(
      selectedCategories,
      selectedAreas
    );
    setRecipes(data);
    setIsLoading(false);
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <Header activePage="search" />

      <div className="flex w-full flex-1 min-h-0">
        {/* Filters section */}
        <div className="h-full flex flex-col w-[400px] p-6 bg-white border-r border-gray-200 overflow-auto gap-6">
          {/* Search Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Search Recipes
            </h3>
            <form
              className="space-y-3"
              onSubmit={(e) => handleNameSearchSubmit(e)}
            >
              <input
                id="name-search"
                name="name-search"
                type="text"
                required
                placeholder="Search recipe by name..."
                value={nameSearchValue}
                onChange={(e) => setNameSearchValue(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Search Recipe
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            
            {/* Filter by category */}
            <FilterSection
              name="category"
              filters={[...categories]}
              selectedFilters={selectedCategories}
              setSelectedFilters={setSelectedCategories}
            />

            {/* Filter by area */}
            <FilterSection
              name="area"
              filters={[...areas]}
              selectedFilters={selectedAreas}
              setSelectedFilters={setSelectedAreas}
            />

            <button
              className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search Results Section */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Search</h2>
              <p className="text-gray-600">Discover delicious recipes from around the world</p>
            </div>

            {/* Results Grid */}
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} userRecipes={userRecipes} />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600">Loading recipes...</p>
              </div>
            )}

            {/* Load More Button */}
            {recipes.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={getRecipes}
                  disabled={isLoading}
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Load Random Recipes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
