import { useAuth } from "@/AuthContext";
import Header from "@/components/Header";
import { addRecipe, getUserRecipes, updateRecipe } from "@/RecipeDB/recipeDB";
import type { Area, Category, Recipe, RecipeIngredient } from "@/types/type";
import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  createColumnHelper,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Search, Bookmark, Plus, MapPin, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import RecipeEditPopup from "@/components/RecipeEditPopup";
import { toast } from "react-toastify";

type RecipeCardItem = {
  id: string;
  name: string;
  area: Area;
  category: Category;
  ingredients: RecipeIngredient[];
  imageUrl: string;
};

function recipesToRecipeCardItems(recipes: Recipe[]): RecipeCardItem[] {
  return recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    area: recipe.area,
    category: recipe.category,
    ingredients: recipe.ingredients,
    imageUrl: recipe.imageUrl,
  }));
}

// Custom Pagination Component
function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SavedRecipes() {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (user?.uid) {
      initialize();
    }
  }, [user]);

  async function initialize() {
    // fetch user saved recipes from Firestore
    if (user) {
      const saved = await getUserRecipes(user.uid);
      setUserRecipes(saved);
    }
  }

  //   The table data
  const data = useMemo(() => {
    return recipesToRecipeCardItems(userRecipes);
  }, [userRecipes]);

  const columnHelper = createColumnHelper<RecipeCardItem>();

  const columns = [
    columnHelper.accessor("name", {
      filterFn: "includesString",
    }),
    columnHelper.accessor("area", {
      filterFn: "includesString",
    }),
    columnHelper.accessor("category", {
      filterFn: "includesString",
    }),
    columnHelper.accessor(
      (row) => row.ingredients.map((i) => i.name).join(", "),
      {
        id: "ingredients",
        header: "Ingredients",
        filterFn: "includesString",
      }
    ),
  ];

  const table = useReactTable({
    data: data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  async function handleSaveRecipe(recipe: Recipe) {
    // Update local recipes list:
    setUserRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      if (exists) {
        // Update existing recipe
        return prev.map((r) => (r.id === recipe.id ? recipe : r));
      } else {
        // Add new recipe
        return [...prev, recipe];
      }
    });
  }

  // Pagination logic
  const filteredRows = table.getRowModel().rows;
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRows = filteredRows.slice(startIndex, endIndex);

  // Debug logging
  console.log('Pagination Debug:', {
    totalRecipes: userRecipes.length,
    filteredRows: filteredRows.length,
    totalPages,
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
    currentPageRows: currentPageRows.length
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [globalFilter, columnFilters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of content area
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      <Header activePage="saved" onSaveRecipe={handleSaveRecipe} />

      <div className="flex w-full flex-1 min-h-0">
        {/* Sidebar */}
        <div className="h-full flex flex-col w-[400px] p-6 bg-white border-r border-gray-200 overflow-auto gap-6">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>
            <p className="text-gray-600">Your personal collection of favorite recipes</p>
          </div>

          {/* Search Bar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Search Recipes
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search your recipes..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto content-area">
          <div className="max-w-7xl mx-auto p-8">
            {table.getRowModel().rows.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentPageRows.map((row) => (
                    <div 
                      key={row.original.name}
                      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                      onClick={() => {
                        const recipe = userRecipes.find(
                          (r) => r.id == row.original.id
                        );
                        if (recipe) {
                          setSelectedRecipe(recipe);
                          setOpen(true);
                        }
                      }}
                    >
                      {/* Image Container */}
                      <div className="relative">
                        <img
                          alt={row.original.name}
                          src={row.original.imageUrl}
                          className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Recipe info overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <div className="flex items-center gap-2 text-white text-xs">
                            <MapPin className="w-3 h-3" />
                            <span className="font-medium">{row.original.area}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {row.original.name}
                        </h3>
                        
                        {/* Category */}
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600 font-medium">{row.original.category}</span>
                        </div>

                        {/* Tags */}
                        {row.original.ingredients && row.original.ingredients.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {row.original.ingredients.slice(0, 3).map((ingredient, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 font-medium"
                              >
                                {ingredient.name}
                              </span>
                            ))}
                            {row.original.ingredients.length > 3 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{row.original.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination - Always show when there are recipes */}
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved recipes yet</h3>
                <p className="text-gray-600 mb-6">Start building your recipe collection by saving your favorite recipes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <RecipeEditPopup
          open={open}
          setOpen={setOpen}
          recipe={selectedRecipe}
          onSave={async (updatedRecipe) => {
            try {
              if (!updatedRecipe.id) {
                console.error("Missing recipe ID for update.");
                toast.error("Cannot find recipe");
                return;
              }

              if (!user || !user.uid) {
                console.error(
                  "User is not logged in. Cannot update recipe."
                );
                toast.error("Please log in first");
                return;
              }

              const userId = user.uid;

              await updateRecipe(userId, updatedRecipe.id, updatedRecipe);
              // Update local userRecipes state:
              setUserRecipes((prevRecipes) =>
                prevRecipes.map((r) =>
                  r.id === updatedRecipe.id ? updatedRecipe : r
                )
              );

              toast.success("Recipe saved!");
            } catch (error) {
              console.error("Error saving recipe:", error);
              toast.error("Error saving recipe");
            }
          }}
        />
      )}
    </div>
  );
}
