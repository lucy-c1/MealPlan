import { useAuth } from "@/AuthContext";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import type { Recipe } from "@/types/type";
import { getUserRecipes } from "@/RecipeDB/recipeDB";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type MealSlot = "breakfast" | "lunch" | "dinner";
const meals: MealSlot[] = ["breakfast", "lunch", "dinner"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type PlacedRecipe = {
  recipe: Recipe;
  dayIndex: number;
  meal: MealSlot;
};

export default function MealPlan() {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  // State for recipes placed in the grid
  const [placedRecipes, setPlacedRecipes] = useState<PlacedRecipe[]>([]);

  useEffect(() => {
    if (user?.uid) {
      initialize();
    }
  }, [user]);

  async function initialize() {
    if (user) {
      const saved = await getUserRecipes(user.uid);
      setUserRecipes(saved);
    }
  }

  // Drag source for recipes
  function RecipeCard({ recipe }: { recipe: Recipe }) {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "RECIPE",
      item: { recipe },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        // @ts-ignore-error
        ref={drag}
        className={`border rounded p-2 mb-2 cursor-move bg-white ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-24 object-cover rounded"
        />
        <p className="mt-1 text-center font-semibold">{recipe.name}</p>
      </div>
    );
  }

  // Drop target for grid cells
  function MealCell({ dayIndex, meal }: { dayIndex: number; meal: MealSlot }) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ["RECIPE", "PLACED_RECIPE"],
      drop: (item) => {
        setPlacedRecipes((prev) => {
          // Remove the recipe from its old cell if it is a moved recipe
          let filtered = prev;
          if ("dayIndex" in item && "meal" in item) {
            filtered = prev.filter(
              (r) => !(r.dayIndex === item.dayIndex && r.meal === item.meal)
            );
          }
          // Remove any recipe currently in this cell (replace)
          filtered = filtered.filter(
            (r) => !(r.dayIndex === dayIndex && r.meal === meal)
          );
          return [...filtered, { recipe: item.recipe, dayIndex, meal }];
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    const placedRecipe = placedRecipes.find(
      (r) => r.dayIndex === dayIndex && r.meal === meal
    );

    return (
      <div
        ref={drop}
        className={`border h-32 p-1 flex flex-col items-center justify-center rounded ${
          isOver && canDrop ? "bg-green-200" : "bg-gray-50"
        }`}
      >
        <div className="text-xs font-semibold mb-1">{meal}</div>
        {placedRecipe ? (
          <DraggablePlacedRecipe
            recipe={placedRecipe.recipe}
            dayIndex={dayIndex}
            meal={meal}
          />
        ) : (
          <span className="text-gray-400 text-xs">Drop recipe here</span>
        )}
      </div>
    );
  }

  function DraggablePlacedRecipe({ recipe, dayIndex, meal }) {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "PLACED_RECIPE",
      item: { recipe, dayIndex, meal },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`cursor-move ${isDragging ? "opacity-50" : "opacity-100"}`}
      >
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="h-16 w-full object-cover rounded"
        />
        <p className="text-sm truncate">{recipe.name}</p>
      </div>
    );
  }

  return (
    <div>
      <Header activePage="plan" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen gap-4 p-4 bg-gray-100">
          {/* Left column: user recipes */}
          <div className="w-72 overflow-y-auto bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Your Recipes</h2>
            {userRecipes.length === 0 && <p>No recipes found.</p>}
            {userRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Right grid: 7 columns x 3 rows */}
          <div className="flex-1 overflow-auto">
            <h2 className="text-lg font-bold mb-4">Meal Plan</h2>

            <div className="grid grid-cols-7 gap-2">
              {/* Header row with days */}
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold p-1 bg-gray-200 rounded"
                >
                  {day}
                </div>
              ))}

              {/* For each meal (row) x day (column) */}
              {meals.map((meal) =>
                days.map((_, dayIndex) => (
                  <MealCell
                    key={`${meal}-${dayIndex}`}
                    meal={meal}
                    dayIndex={dayIndex}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}
