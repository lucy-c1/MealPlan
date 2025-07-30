import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { areas, categories, type Recipe } from "../types/type";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function YouTubeEmbed({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-xl"
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
  onSave: (updated: Recipe) => void; // Pass edited recipe back to parent
}) {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);

  useEffect(() => {
    setEditedRecipe(recipe); // Reset on open
  }, [recipe]);

  const handleChange = <K extends keyof Recipe>(field: K, value: Recipe[K]) => {
    setEditedRecipe((prev) => ({ ...prev, [field]: value }));
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

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...editedRecipe.tags];
    newTags[index] = value;
    handleChange("tags", newTags);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="max-h-[85vh] overflow-auto scrollbar-hide relative transform rounded-lg bg-white px-10 pb-7 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="sticky top-0 z-20 pb-2 flex justify-between items-start pt-7 bg-orange-800 -mx-10 px-10">
              <DialogTitle as="h3" className="text-xl font-bold text-white">
                <input
                  className="w-full bg-transparent text-white font-bold outline-none"
                  value={editedRecipe.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </DialogTitle>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-orange-800"
              >
                <X className="size-6 text-orange-800" />
              </button>
            </div>

            <div className="w-full">
              <div className="mt-3 flex flex-col gap-1 pt-2">
                {editedRecipe.youtubeUrl ? (
                  <YouTubeEmbed videoUrl={editedRecipe.youtubeUrl} />
                ) : (
                  <img
                    alt=""
                    src={editedRecipe.imageUrl}
                    className="aspect-4/2 w-full rounded-2xl object-cover shadow-sm"
                  />
                )}

                {/* General Info */}
                <p className="text-base font-bold mt-4 border-b border-gray-200 pb-1">
                  General Information
                </p>
                <div className="bg-neutral-50 rounded-lg py-2 px-3 flex flex-col gap-2">
                  <Select
                    value={editedRecipe.area}
                    onValueChange={(value) =>
                      handleChange("area", value as (typeof areas)[number])
                    }
                  >
                    <SelectTrigger className="w-full border px-2 py-1 rounded">
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

                  <Select
                    value={editedRecipe.category}
                    onValueChange={(value) =>
                      handleChange(
                        "category",
                        value as (typeof categories)[number]
                      )
                    }
                  >
                    <SelectTrigger className="w-full border px-2 py-1 rounded">
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
                  <div className="flex flex-wrap gap-2">
                    {editedRecipe.tags.map((tag, i) => (
                      <input
                        key={i}
                        value={tag}
                        onChange={(e) => handleTagChange(i, e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <p className="text-base font-bold mt-4 border-b border-gray-200 pb-1">
                  🍴 Ingredients
                </p>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-gray-600 bg-neutral-50 rounded-lg py-2 pl-3">
                  {editedRecipe.ingredients.map((ing, index) => (
                    <>
                      <input
                        key={`name-${index}`}
                        value={ing.name}
                        onChange={(e) =>
                          handleIngredientChange(index, "name", e.target.value)
                        }
                        className="border px-1 py-1 rounded"
                      />
                      <input
                        key={`amount-${index}`}
                        value={ing.amount}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        className="border px-1 py-1 rounded font-semibold"
                      />
                    </>
                  ))}
                </div>

                {/* Instructions */}
                <p className="text-base font-bold mt-4 border-b border-gray-200 pb-1">
                  📋 Instructions
                </p>
                <textarea
                  value={editedRecipe.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  className="w-full bg-neutral-50 p-2 rounded-lg text-gray-700"
                  rows={5}
                />

                {/* Save Button */}
                <button
                  onClick={() => {
                    onSave(editedRecipe); // Send updated recipe back
                    setOpen(false);
                  }}
                  className="mt-4 bg-orange-800 text-white py-2 px-4 rounded hover:bg-orange-700"
                >
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
