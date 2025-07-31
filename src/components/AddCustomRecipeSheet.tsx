import {
  areas,
  categories,
  type Area,
  type Category,
  type Recipe,
  type RecipeIngredient,
} from "@/types/type";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "react-toastify";
import { Plus, Trash2, Save, ChefHat } from "lucide-react";

export function AddCustomRecipeSheet({
  onSave,
  trigger,
}: {
  onSave: (recipe: Recipe) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const [recipe, setRecipe] = useState<
    Omit<Recipe, "id" | "tags" | "ingredients">
  >({
    name: "",
    area: areas[0],
    category: categories[0],
    instructions: "",
    imageUrl: "",
    youtubeUrl: "",
  });

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: "", amount: "" },
  ]);
  const [tags, setTags] = useState<string[]>([]);

  // Simple handler for inputs
  const handleChange = <K extends keyof typeof recipe>(
    field: K,
    value: (typeof recipe)[K]
  ) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  // Ingredient handlers
  const handleIngredientChange = (
    index: number,
    key: keyof RecipeIngredient,
    value: string
  ) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Tag handlers
  const addTag = () => {
    setTags((prev) => [...prev, ""]);
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, value: string) => {
    setTags((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // On Save
  const handleSave = () => {
    if (!recipe.name.trim()) {
      toast.error("Recipe name is required");
      return;
    }
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      ingredients: ingredients.filter(ing => ing.name.trim() && ing.amount.trim()),
      tags: tags.filter(tag => tag.trim()),
    };
    onSave(newRecipe);
    setOpen(false);

    // Reset fields
    setRecipe({
      name: "",
      area: areas[0],
      category: categories[0],
      instructions: "",
      imageUrl: "",
      youtubeUrl: "",
    });
    setIngredients([{ name: "", amount: "" }]);
    setTags([]);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2">
            <Plus className="w-4 h-4" />
            Add Custom Recipe
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[600px] !max-w-none p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-gray-900">Add Custom Recipe</SheetTitle>
                <p className="text-sm text-gray-600">Create your own recipe</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Recipe Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Recipe Name *</label>
              <Input
                placeholder="Enter recipe name..."
                value={recipe.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            {/* General Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                General Information
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Area</label>
                  <Select
                    value={recipe.area}
                    onValueChange={(value) => handleChange("area", value as Area)}
                  >
                    <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <Select
                    value={recipe.category}
                    onValueChange={(value) => handleChange("category", value as Category)}
                  >
                    <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Tags</label>
                  <div className="space-y-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Enter tag..."
                        />
                        <button
                          onClick={() => removeTag(index)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No tags added yet</p>
                    )}
                  </div>
                  <button
                    onClick={addTag}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tag
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                🍴 Ingredients
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Ingredient name..."
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Amount..."
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                        className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addIngredient}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Ingredient
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                📋 Instructions
              </h4>
              <Textarea
                placeholder="Enter cooking instructions..."
                value={recipe.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                className="w-full bg-gray-50 p-4 rounded-xl text-gray-700 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                rows={6}
              />
            </div>

            {/* Media URLs */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Media
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Image URL</label>
                  <Input
                    placeholder="Enter image URL..."
                    value={recipe.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">YouTube URL (optional)</label>
                  <Input
                    placeholder="Enter YouTube URL..."
                    value={recipe.youtubeUrl}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="p-6 border-t border-gray-200">
            <div className="flex justify-end gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-xl border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600"
              >
                <Save className="w-4 h-4" />
                Save Recipe
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
