import { useState } from "react";
import type { Recipe } from "../types/type";
import RecipeDetailsPopup from "./RecipeDetailsPopup";
import { Star, MapPin, Tag, Heart } from "lucide-react";
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
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => setOpen(true)}
    >
      {/* Image Container */}
      <div className="relative">
        <img
          alt={recipe.name}
          src={recipe.imageUrl}
          className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with save button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking save button
              handleSaveRecipe(recipe);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <Star
              className={cn(
                "w-5 h-5 text-gray-600 transition-colors duration-200",
                (isStarClicked || alreadySaved) 
                  ? "text-yellow-500 fill-yellow-500" 
                  : "group-hover:text-yellow-500"
              )}
            />
          </button>
        </div>

        {/* Recipe info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center gap-2 text-white text-xs">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{recipe.area}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3
          title="Click for more recipe info"
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
        >
          {recipe.name}
        </h3>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-600 font-medium">{recipe.category}</span>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 font-medium"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{recipe.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hidden details popup */}
      <RecipeDetailsPopup open={open} setOpen={setOpen} recipe={recipe} />
    </div>
  );
}
