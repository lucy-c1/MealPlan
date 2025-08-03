import { useAuth } from "@/AuthContext";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import type {
  Recipe,
  Plan,
  Day,
  Meal,
  MealType,
  DayOfWeek,
} from "@/types/type";
import {
  getUserRecipes,
  savePlan,
  getUserPlans,
  updatePlan,
} from "@/RecipeDB/recipeDB";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Save,
  Loader2,
  X,
  ChefHat,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameWeek,
} from "date-fns";
import { cn } from "@/lib/utils";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RecipeDetailsPopup from "@/components/RecipeDetailsPopup";

type MealSlot = "breakfast" | "lunch" | "dinner";
const meals: MealSlot[] = ["breakfast", "lunch", "dinner"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type PlacedRecipe = {
  recipe: Recipe;
  dayIndex: number;
  meal: MealSlot;
};

type DragItem = {
  recipe: Recipe;
  dayIndex?: number;
  meal?: MealSlot;
};

export default function MealPlan() {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [userPlans, setUserPlans] = useState<Plan[]>([]);

  // State for recipes placed in the grid
  const [placedRecipes, setPlacedRecipes] = useState<PlacedRecipe[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Date selection state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (user?.uid) {
      initialize();
    }
  }, [user]);

  async function initialize() {
    if (user) {
      const saved = await getUserRecipes(user.uid);
      setUserRecipes(saved);

      const plans = await getUserPlans(user.uid);
      setUserPlans(plans);
    }
  }

  // Handle new recipe being saved
  async function handleSaveRecipe(recipe: Recipe) {
    // Refresh the user recipes list
    if (user) {
      const saved = await getUserRecipes(user.uid);
      setUserRecipes(saved);
    }
  }

  // Load plan for selected date range
  useEffect(() => {
    if (user?.uid) {
      loadPlanForDate(selectedDate);
    }
  }, [selectedDate, userPlans, user]);

  function loadPlanForDate(date: Date) {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Sunday

    // Find existing plan for this week
    const existingPlan = userPlans.find((plan) => {
      const planStart = plan.startDate.toDate();
      const planEnd = plan.endDate.toDate();
      return isSameWeek(planStart, weekStart, { weekStartsOn: 1 });
    });

    if (existingPlan) {
      setCurrentPlan(existingPlan);
      // Convert plan back to placed recipes
      const recipes: PlacedRecipe[] = [];
      existingPlan.days.forEach((day, dayIndex) => {
        day.meals.forEach((meal) => {
          const recipe = userRecipes.find((r) => r.id === meal.recipeId);
          if (recipe) {
            const mealSlot: MealSlot =
              meal.category === "Breakfast"
                ? "breakfast"
                : meal.category === "Lunch"
                ? "lunch"
                : "dinner";
            recipes.push({
              recipe,
              dayIndex,
              meal: mealSlot,
            });
          }
        });
      });
      setPlacedRecipes(recipes);
    } else {
      setCurrentPlan(null);
      setPlacedRecipes([]);
    }
  }

  // Convert placed recipes to Plan format
  function convertToPlan(): Plan {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    const dayNames: DayOfWeek[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const days: [Day, Day, Day, Day, Day, Day, Day] = dayNames.map(
      (dayName, dayIndex) => {
        const dayMeals: Meal[] = [];

        // Add meals for this day
        meals.forEach((mealSlot) => {
          const placedRecipe = placedRecipes.find(
            (r) => r.dayIndex === dayIndex && r.meal === mealSlot
          );

          if (placedRecipe) {
            const mealType: MealType =
              mealSlot === "breakfast"
                ? "Breakfast"
                : mealSlot === "lunch"
                ? "Lunch"
                : "Dinner";

            dayMeals.push({
              category: mealType,
              recipeId: placedRecipe.recipe.id,
            });
          }
        });

        return {
          dayOfWeek: dayName,
          meals: dayMeals,
        };
      }
    ) as [Day, Day, Day, Day, Day, Day, Day];

    return {
      id: currentPlan?.id || crypto.randomUUID(),
      startDate: Timestamp.fromDate(weekStart),
      endDate: Timestamp.fromDate(weekEnd),
      days,
    };
  }

  // Save or update the current meal plan
  async function handleSavePlan() {
    if (!user?.uid) {
      toast.error("Please log in to save your meal plan.");
      return;
    }

    if (placedRecipes.length === 0) {
      toast.error("Please add some recipes to your meal plan before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const plan = convertToPlan();

      if (currentPlan) {
        // Update existing plan
        await updatePlan(user.uid, currentPlan.id, plan);
        toast.success("Meal plan updated successfully!");
      } else {
        // Create new plan
        await savePlan(user.uid, plan);
        toast.success("Meal plan saved successfully!");
      }

      // Refresh plans list
      const updatedPlans = await getUserPlans(user.uid);
      setUserPlans(updatedPlans);
    } catch (error) {
      console.error("Failed to save meal plan:", error);
      toast.error("Failed to save meal plan. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Drag source for recipes
  function RecipeCard({ recipe }: { recipe: Recipe }) {
    const [{ isDragging }, drag] = useDrag<
      DragItem,
      void,
      { isDragging: boolean }
    >(() => ({
      type: "RECIPE",
      item: { recipe },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag as any}
        className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-move ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <div className="flex items-center gap-1 text-white text-xs">
              <ChefHat className="w-3 h-3" />
              <span className="font-medium">{recipe.area}</span>
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {recipe.name}
          </p>
          <p className="text-xs text-gray-600 mt-1">{recipe.category}</p>
        </div>
      </div>
    );
  }

  // Drop target for grid cells
  function MealCell({ dayIndex, meal }: { dayIndex: number; meal: MealSlot }) {
    const [{ isOver, canDrop }, drop] = useDrop<
      DragItem,
      void,
      { isOver: boolean; canDrop: boolean }
    >(() => ({
      accept: ["RECIPE", "PLACED_RECIPE"],
      drop: (item: DragItem) => {
        setPlacedRecipes((prev) => {
          // Remove the recipe from its old cell if it is a moved recipe
          let filtered = prev;
          if (
            "dayIndex" in item &&
            "meal" in item &&
            item.dayIndex !== undefined &&
            item.meal !== undefined
          ) {
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

    const getMealColor = (meal: MealSlot) => {
      switch (meal) {
        case "breakfast":
          return "text-blue-500";
        case "lunch":
          return "text-orange-500";
        case "dinner":
          return "text-green-500";
        default:
          return "text-neutral-800";
      }
    };

    return (
      <div
        ref={drop as any}
        className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px] transition-all duration-200 ${
          isOver && canDrop
            ? "bg-green-100 border-green-400"
            : placedRecipe
            ? "bg-white border-gray-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div
          className={cn(
            "text-xs font-semibold mb-2 text-gray-600 flex items-center gap-1"
          )}
        >
          <span className="capitalize">{meal}</span>
        </div>
        {placedRecipe ? (
          <DraggablePlacedRecipe
            recipe={placedRecipe.recipe}
            dayIndex={dayIndex}
            meal={meal}
          />
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <ChefHat
                className={cn("w-4 h-4 text-gray-400", getMealColor(meal))}
              />
            </div>
            <span className="text-gray-400 text-xs">Drop recipe here</span>
          </div>
        )}
      </div>
    );
  }

  function DraggablePlacedRecipe({
    recipe,
    dayIndex,
    meal,
  }: {
    recipe: Recipe;
    dayIndex: number;
    meal: MealSlot;
  }) {
    const [{ isDragging }, drag] = useDrag<
      DragItem,
      void,
      { isDragging: boolean }
    >(() => ({
      type: "PLACED_RECIPE",
      item: { recipe, dayIndex, meal },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPlacedRecipes((prev) =>
        prev.filter((r) => !(r.dayIndex === dayIndex && r.meal === meal))
      );
    };

    const [open, setOpen] = useState(false);

    return (
      <div
        ref={drag as any}
        className={`relative cursor-move ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="h-16 w-full object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
            title="Remove recipe"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs font-medium text-gray-900 truncate mt-1">
          {recipe.name}
        </p>
        <RecipeDetailsPopup open={open} setOpen={setOpen} recipe={recipe} />
      </div>
    );
  }

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header activePage="plan" onSaveRecipe={handleSaveRecipe} />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-1 gap-6 p-6">
          {/* Left column: user recipes */}
          <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Recipes
                  </h2>
                  <p className="text-sm text-gray-600">
                    Drag recipes to plan your week
                  </p>
                </div>
              </div>
              {userRecipes.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No recipes found</p>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {userRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>

          {/* Right grid: meal planning area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Meal Plan
                      </h2>
                      <p className="text-sm text-gray-600">
                        Plan your weekly meals
                      </p>
                    </div>
                  </div>

                  {/* Date Selector */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Week Display */}
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    {format(weekStart, "MMM d")} -{" "}
                    {format(weekEnd, "MMM d, yyyy")}
                  </div>

                  {/* Plan Status */}
                  {currentPlan && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      Plan exists
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSavePlan}
                  disabled={isSaving || placedRecipes.length === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving
                    ? "Saving..."
                    : currentPlan
                    ? "Update Plan"
                    : "Save Plan"}
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-7 gap-3">
                {/* Header row with days */}
                {days.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold p-3 bg-gray-50 rounded-xl text-gray-700"
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
        </div>
      </DndProvider>
    </div>
  );
}
