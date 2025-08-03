import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, Clock, Users, MapPin, Tag } from "lucide-react";
import type { Recipe } from "../types/type";

function YouTubeEmbed({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-2xl shadow-xl"
        src={videoUrl.replace("watch?v=", "embed/")}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default function RecipeDetailsPopup({
  open,
  setOpen,
  recipe,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recipe: Recipe;
}) {
  const steps = recipe.instructions
    .split(/(?<=[.?!])\s+/) // Split after ., ?, or ! followed by whitespace
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="max-h-[90vh] overflow-auto scrollbar-hide relative transform rounded-2xl bg-white px-0 pb-0 text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-white border-b border-gray-100 rounded-t-2xl">
              <DialogTitle as="h3" className="text-2xl font-bold text-gray-900">
                {recipe.name}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden transition-all duration-200 p-2"
              >
                <span className="sr-only">Close</span>
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image/Video */}
              {recipe?.youtubeUrl ? (
                <YouTubeEmbed videoUrl={recipe.youtubeUrl} />
              ) : (
                <div className="relative">
                  <img
                    alt=""
                    src={recipe.imageUrl}
                    className="aspect-4/3 w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
              )}
              
              {/* Recipe Stats */}
              <div className="flex justify-center gap-8 py-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">30 min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">4 servings</span>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{recipe.area}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{recipe.category}</span>
                  </div>
                </div>
                
                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  Ingredients
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {recipe.ingredients.map(({ name, amount }, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700 font-medium">{name}</span>
                      <span className="text-gray-500 text-sm">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  Instructions
                </h4>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
