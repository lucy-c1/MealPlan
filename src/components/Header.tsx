import { Bookmark, Calendar, User, Search, ChefHat, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AddCustomRecipeSheet } from "./AddCustomRecipeSheet";
import type { Recipe } from "@/types/type";
import { addRecipe } from "@/RecipeDB/recipeDB";
import { toast } from "react-toastify";

export type HeaderProps = {
  activePage: "search" | "plan" | "saved";
  onSaveRecipe?: (recipe: Recipe) => void;
};

export default function Header({ activePage, onSaveRecipe }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      if (!user || !user.uid) {
        console.error("User not logged in. Cannot save recipe.");
        toast.error("Please log in to save your recipe.");
        return;
      }

      await addRecipe(user.uid, recipe);

      console.log("Recipe saved successfully!");
      toast.success("Recipe saved!");

      // If a custom onSaveRecipe handler is provided, call it as well
      if (onSaveRecipe) {
        onSaveRecipe(recipe);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Error saving recipe");
    }
  };

  return (
    <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-xl text-gray-900">MealPlan</p>
          <p className="text-xs text-gray-500">Delicious recipes, planned perfectly</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
            activePage === "search"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          onClick={() => {
            if (activePage !== "search") {
              navigate("/");
            }
          }}
        >
          <Search className="w-4 h-4" />
          Recipe Search
        </button>

        <button
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
            activePage === "plan"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          onClick={() => {
            if (activePage !== "plan") {
              navigate("/plan");
            }
          }}
        >
          <Calendar className="w-4 h-4" />
          Meal Planner
        </button>

        <button
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
            activePage === "saved"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          onClick={() => {
            if (activePage !== "saved") {
              navigate("/saved");
            }
          }}
        >
          <Bookmark className="w-4 h-4" />
          Saved Recipes
        </button>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3">
        {/* Add Custom Recipe Button - Subtle design */}
        {user && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <AddCustomRecipeSheet 
                  onSave={handleSaveRecipe}
                  trigger={
                    <button className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md">
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Add Custom Recipe</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Profile Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{user?.email}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
