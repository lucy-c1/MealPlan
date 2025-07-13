import { useState } from "react";
import type { Recipe } from "../types/type";
import RecipeDetailsPopup from "./RecipeDetailsPopup";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { addRecipe } from "@/RecipeDB/recipeDB";
import { useAuth } from "@/AuthContext";
import { toast } from "react-toastify";

export default function RecipeCard({
  recipe,
  userRecipes,
}: {
  recipe: Recipe;
  userRecipes: Recipe[];
}) {
  // for the recipe details popup
  const [open, setOpen] = useState(false);
  const [isStarClicked, setIsStarClicked] = useState(false);

  const alreadySaved = userRecipes.some((r) => r.id === recipe.id);

  const { user } = useAuth();

  console.log(userRecipes);

  async function handleSaveRecipe(recipe: Recipe) {
    if (alreadySaved || isStarClicked) {
      toast("Recipe already saved!");
      return; // Don't save again
    }

    if (!user) {
      toast.error("You must be logged in to save recipes.");
      return;
    }

    try {
      await addRecipe(user.uid, recipe);
      toast.success("Recipe saved!");
      setIsStarClicked(true);
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast.error("Failed to save recipe. Please try again.");
    }
  }

  return (
    <div className="relative group">
      {/* Star icon shown on hover */}
      <div
        className="absolute top-2 right-2 z-10 hidden group-hover:block cursor-pointer"
        onClick={() => handleSaveRecipe(recipe)} // call your save function
      >
        <Star
          className={cn(
            "w-6 h-6 text-yellow-400",
            (isStarClicked || alreadySaved) && "fill-yellow-400"
          )}
        />
      </div>

      {/* Card content */}
      <div key={recipe.name}>
        <img
          alt=""
          src={recipe.imageUrl}
          className="aspect-3/2 w-full rounded-2xl object-cover"
        />
        <h3
          title="Click for more recipe info"
          className="mt-6 text-lg/8 font-semibold text-gray-900 cursor-pointer inline-flex hover:text-gray-600"
          onClick={() => setOpen(true)}
        >
          {recipe.name}
        </h3>
        <p className="text-base/7 text-gray-600">Area: {recipe.area}</p>
        <p className="text-base/7 text-gray-600">Category: {recipe.category}</p>

        {/* ... your tags and YouTube icon ... */}
      </div>

      {/* Hidden details popup */}
      <RecipeDetailsPopup open={open} setOpen={setOpen} recipe={recipe} />
    </div>
  );
}
