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

export function AddCustomRecipeSheet({
  onSave,
}: {
  onSave: (recipe: Recipe) => void;
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

  // Tag handlers (simple comma separated tags)
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(
      e.target.value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    );
  };

  // On Save
  const handleSave = () => {
    if (!recipe.name.trim()) {
      toast.error("name is required");
      return;
    }
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      ingredients,
      tags,
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
        <Button variant="outline" className="px-4 py-2 rounded cursor-pointer">
          + Add Custom Recipe
        </Button>
      </SheetTrigger>
      <SheetContent className="px-5 w-[500px] !max-w-none">
        <SheetHeader>
          <SheetTitle>Add Custom Recipe</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            placeholder="Recipe Name"
            value={recipe.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <Select
            value={recipe.area}
            onValueChange={(value) => handleChange("area", value as Area)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={recipe.category}
            onValueChange={(value) =>
              handleChange("category", value as Category)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <label className="block mb-1 font-semibold">Ingredients</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) =>
                    handleIngredientChange(i, "name", e.target.value)
                  }
                />
                <Input
                  placeholder="Amount"
                  value={ing.amount}
                  onChange={(e) =>
                    handleIngredientChange(i, "amount", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="text-red-600 hover:text-red-800"
                >
                  &times;
                </button>
              </div>
            ))}
            <Button variant="ghost" onClick={addIngredient} className="w-full">
              + Add Ingredient
            </Button>
          </div>

          <Textarea
            placeholder="Instructions"
            value={recipe.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
            rows={4}
          />

          <Input
            placeholder="Image URL"
            value={recipe.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
          />

          <Input
            placeholder="YouTube URL"
            value={recipe.youtubeUrl}
            onChange={(e) => handleChange("youtubeUrl", e.target.value)}
          />

          <Input
            placeholder="Tags (comma separated)"
            value={tags.join(", ")}
            onChange={handleTagsChange}
          />
        </div>

        <SheetFooter className="mt-4">
          <SheetClose>
            <Button onClick={handleSave} className="w-full">
              Save Recipe
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
