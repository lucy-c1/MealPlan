import { useAuth } from "@/AuthContext";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import type { Recipe, Plan, Day, Meal, MealType, DayOfWeek } from "@/types/type";
import { getUserRecipes, savePlan, getUserPlans, updatePlan } from "@/RecipeDB/recipeDB";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Loader2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameWeek } from "date-fns";
import { cn } from "@/lib/utils";

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
    const existingPlan = userPlans.find(plan => {
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
          const recipe = userRecipes.find(r => r.id === meal.recipeId);
          if (recipe) {
            const mealSlot: MealSlot = meal.category === "Breakfast" ? "breakfast" : 
                                      meal.category === "Lunch" ? "lunch" : "dinner";
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
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    const days: [Day, Day, Day, Day, Day, Day, Day] = dayNames.map((dayName, dayIndex) => {
      const dayMeals: Meal[] = [];
      
      // Add meals for this day
      meals.forEach((mealSlot) => {
        const placedRecipe = placedRecipes.find(
          (r) => r.dayIndex === dayIndex && r.meal === mealSlot
        );
        
        if (placedRecipe) {
          const mealType: MealType = mealSlot === "breakfast" ? "Breakfast" : 
                                   mealSlot === "lunch" ? "Lunch" : "Dinner";
          
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
    }) as [Day, Day, Day, Day, Day, Day, Day];

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
    const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
      type: "RECIPE",
      item: { recipe },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag as any}
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
    const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
      accept: ["RECIPE", "PLACED_RECIPE"],
      drop: (item: DragItem) => {
        setPlacedRecipes((prev) => {
          // Remove the recipe from its old cell if it is a moved recipe
          let filtered = prev;
          if ("dayIndex" in item && "meal" in item && item.dayIndex !== undefined && item.meal !== undefined) {
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
        ref={drop as any}
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

  function DraggablePlacedRecipe({ 
    recipe, 
    dayIndex, 
    meal 
  }: { 
    recipe: Recipe; 
    dayIndex: number; 
    meal: MealSlot; 
  }) {
    const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
      type: "PLACED_RECIPE",
      item: { recipe, dayIndex, meal },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag as any}
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

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold">Meal Plan</h2>
                
                {/* Date Selector */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
                <div className="text-sm text-gray-600">
                  {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                </div>

                {/* Plan Status */}
                {currentPlan && (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Plan exists
                  </div>
                )}
              </div>

              <Button 
                onClick={handleSavePlan}
                disabled={isSaving || placedRecipes.length === 0}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : currentPlan ? "Update Plan" : "Save Plan"}
              </Button>
            </div>

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
