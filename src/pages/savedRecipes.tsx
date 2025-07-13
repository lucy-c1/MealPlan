import { useAuth } from "@/AuthContext";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { getUserRecipes } from "@/RecipeDB/recipeDB";
import type { Recipe } from "@/types/type";
import { useEffect, useState } from "react";

export default function SavedRecipes() {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

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

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header activePage="saved" />

      {/* Scrollable container */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-3 gap-x-8 gap-y-10 p-10">
          {userRecipes.map((recipe: Recipe) => (
            <RecipeCard recipe={recipe} userRecipes={userRecipes} />
          ))}
        </div>
      </div>
    </div>
  );
}
