import { useAuth } from "@/AuthContext";
import Header from "@/components/Header";
import { getUserRecipes } from "@/RecipeDB/recipeDB";
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

export default function SavedRecipes() {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header activePage="saved" />

      {/* Filters and Search */}
      <div className="flex justify-between items-center p-4 gap-2">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your recipes..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-72"
          />
        </div>
        {/* Add Custom Recipe Button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          + Add Custom Recipe
        </button>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-3 gap-x-8 gap-y-10 p-10">
          {table.getRowModel().rows.map((row) => (
            <div key={row.original.name}>
              <img
                alt=""
                src={row.original.imageUrl}
                className="aspect-3/2 w-full rounded-2xl object-cover"
              />
              <h3
                title="Click for more recipe info"
                className="mt-6 text-lg/8 font-semibold text-gray-900 cursor-pointer inline-flex hover:text-gray-600"
                onClick={() => {}}
              >
                {row.original.name}
              </h3>
              <p className="text-base/7 text-gray-600">
                Area: {row.original.area}
              </p>
              <p className="text-base/7 text-gray-600">
                Category: {row.original.category}
              </p>

              {/* ... your tags and YouTube icon ... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
