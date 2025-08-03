import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, Plus, Trash2, Edit3, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { areas, categories, type Recipe } from "../types/type";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function YouTubeEmbed({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-2xl shadow-lg"
        src={videoUrl.replace("watch?v=", "embed/")}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default function RecipeEditPopup({
  open,
  setOpen,
  recipe,
  onSave,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recipe: Recipe;
  onSave: (updated: Recipe) => void;
}) {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedRecipe(recipe);
    setUploadedImage(null);
  }, [recipe]);

  const handleChange = <K extends keyof Recipe>(field: K, value: Recipe[K]) => {
    setEditedRecipe((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleIngredientChange = (
    index: number,
    key: "name" | "amount",
    value: string
  ) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index][key] = value;
    handleChange("ingredients", newIngredients);
  };

  const addIngredient = () => {
    const newIngredients = [...editedRecipe.ingredients, { name: "", amount: "" }];
    handleChange("ingredients", newIngredients);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = editedRecipe.ingredients.filter((_, i) => i !== index);
    handleChange("ingredients", newIngredients);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...editedRecipe.tags];
    newTags[index] = value;
    handleChange("tags", newTags);
  };

  const addTag = () => {
    const newTags = [...editedRecipe.tags, ""];
    handleChange("tags", newTags);
  };

  const removeTag = (index: number) => {
    const newTags = editedRecipe.tags.filter((_, i) => i !== index);
    handleChange("tags", newTags);
  };

  const currentImageUrl = uploadedImage || editedRecipe.imageUrl;

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="max-h-[90vh] overflow-auto scrollbar-hide relative transform rounded-2xl bg-white px-0 pb-0 text-left shadow-2xl sm:my-8 sm:w-full sm:max-w-2xl">
            {/* Header */}
            <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-white border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-blue-500" />
                <DialogTitle as="h3" className="text-xl font-bold text-gray-900">
                  Edit Recipe
                </DialogTitle>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 p-2"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Recipe Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Recipe Name</label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={editedRecipe.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter recipe name..."
                />
              </div>

              {/* Image/Video Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                  📸 Recipe Image
                </h4>
                
                {/* YouTube URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">YouTube URL (optional)</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={editedRecipe.youtubeUrl || ""}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="Enter YouTube URL..."
                  />
                </div>

                {/* Image Display/Upload */}
                {editedRecipe.youtubeUrl ? (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Video Preview</label>
                    <YouTubeEmbed videoUrl={editedRecipe.youtubeUrl} />
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
                      value={editedRecipe.area}
                      onValueChange={(value) =>
                        handleChange("area", value as (typeof areas)[number])
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {areas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Category</label>
                    <Select
                      value={editedRecipe.category}
                      onValueChange={(value) =>
                        handleChange("category", value as (typeof categories)[number])
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Tags</label>
                    <div className="space-y-2">
                      {(editedRecipe.tags || []).map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
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
                      {(!editedRecipe.tags || editedRecipe.tags.length === 0) && (
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
                  {editedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Ingredient name..."
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          value={ingredient.amount}
                          onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Amount..."
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
                <textarea
                  value={editedRecipe.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  className="w-full bg-gray-50 p-4 rounded-xl text-gray-700 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  rows={6}
                  placeholder="Enter cooking instructions..."
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSave(editedRecipe);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
