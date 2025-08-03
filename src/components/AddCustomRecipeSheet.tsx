import {
  areas,
  categories,
  type Area,
  type Category,
  type Recipe,
  type RecipeIngredient,
} from "@/types/type";
import { useState, useRef } from "react";
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
import { Plus, Trash2, Save, ChefHat, Upload, Image as ImageIcon } from "lucide-react";

export function AddCustomRecipeSheet({
  onSave,
  trigger,
}: {
  onSave: (recipe: Recipe) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Image upload handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        handleChange("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    handleChange("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    setUploadedImage(null);
  };

  const currentImageUrl = uploadedImage || recipe.imageUrl;

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

            {/* Media */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                📸 Media
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                {/* YouTube URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">YouTube URL (optional)</label>
                  <Input
                    placeholder="Enter YouTube URL..."
                    value={recipe.youtubeUrl}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Image Display/Upload */}
                {recipe.youtubeUrl ? (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Video Preview</label>
                    <div className="aspect-video w-full">
                      <iframe
                        className="w-full h-full rounded-2xl shadow-lg"
                        src={recipe.youtubeUrl.replace("watch?v=", "embed/")}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Recipe Image</label>
                    
                    {currentImageUrl ? (
                      <div className="relative group">
                        <img
                          alt="Recipe"
                          src={currentImageUrl}
                          className="aspect-4/3 w-full rounded-2xl object-cover shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              Replace
                            </button>
                            <button
                              onClick={handleRemoveImage}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-4/3 w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium mb-1">Upload Recipe Image</p>
                        <p className="text-sm text-gray-500">Click to select an image</p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {!currentImageUrl && (
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                      </p>
                    )}
                  </div>
                )}
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
