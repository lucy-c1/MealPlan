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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import RecipeEditPopup from "@/components/RecipeEditPopup";
import { toast } from "react-toastify";
import { AddCustomRecipeSheet } from "@/components/AddCustomRecipeSheet";

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
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [open, setOpen] = useState(false);

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
    try {
      if (!user || !user.uid) {
        console.error("User not logged in. Cannot save recipe.");
        toast.error("Please log in to save your recipe.");
        return;
      }

      await addRecipe(user.uid, recipe);

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

      console.log("Recipe saved successfully!");
      toast.success("Recipe saved!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Error saving recipe");
    }
  }

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
        <AddCustomRecipeSheet onSave={handleSaveRecipe} />
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
                onClick={() => {
                  const recipe = userRecipes.find(
                    (r) => r.id == row.original.id
                  );
                  if (recipe) {
                    setSelectedRecipe(recipe); // set the clicked recipe
                    setOpen(true); // open the popup
                  }
                }}
              >
                {row.original.name}
              </h3>
              <p className="text-base/7 text-gray-600">
                Area: {row.original.area}
              </p>
              <p className="text-base/7 text-gray-600">
                Category: {row.original.category}
              </p>
            </div>
          ))}

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
      </div>
    </div>
  );
}
