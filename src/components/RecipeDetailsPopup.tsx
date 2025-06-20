import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { Recipe } from "../types/type";

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
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="max-h-[85vh] overflow-auto scrollbar-hide relative transform rounded-lg bg-white px-10 pb-7 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sticky top-0 z-20 pb-2 flex justify-between items-start pt-7 bg-orange-800 -mx-10 px-10">
              <DialogTitle as="h3" className="text-xl font-bold text-white">
                {recipe.name}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-orange-800 focus:ring-offset-2 focus:outline-hidden"
              >
                <span className="sr-only">Close</span>
                <X aria-hidden="true" className="size-6 text-orange-800" />
              </button>
            </div>
            <div className="w-full">
              <div className="mt-3 text-center sm:mt-0 sm:text-left flex flex-col gap-1 pt-2">
                {recipe?.youtubeUrl ? (
                  <YouTubeEmbed videoUrl={recipe.youtubeUrl} />
                ) : (
                  <img
                    alt=""
                    src={recipe.imageUrl}
                    className="aspect-4/2 w-full rounded-2xl object-cover shadow-sm"
                  />
                )}
                {/* General Info */}
                <p className="text-base font-bold mt-4 border-b border-gray-200 pb-1">
                  General Information
                </p>
                <div className="bg-neutral-50 rounded-lg py-2 pl-3">
                  <p className="text-base/7 text-gray-600">
                    Area: {recipe.area}
                  </p>
                  <p className="text-base/7 text-gray-600">
                    Category: {recipe.category}
                  </p>
                  <div className="flex justify-between"></div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.length > 0 && (
                      <p className="text-base/7 text-gray-600">Tags: </p>
                    )}
                    {recipe?.tags.map((tag) => {
                      return (
                        <p className="text-base/7 text-gray-600 bg-neutral-100 rounded-xl px-2">
                          {tag}
                        </p>
                      );
                    })}
                  </div>
                </div>
                {/* Ingredients */}
                <p className="text-base font-bold mt-4 border-b border-gray-200 pb-1">
                  🍴 Ingredients
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 max-w-xs text-gray-600 bg-neutral-50 rounded-lg py-2 pl-3">
                  {recipe.ingredients.map(({ name, amount }) => (
                    <>
                      <div className="text-base/7">{name}</div>
                      <div className="font-semibold text-base/7">{amount}</div>
                    </>
                  ))}
                </div>
                {/* Instructions */}
                <p className="text-base font-bold mt-4 border-b border-gray-200 pb-1">
                  📋 Instructions
                </p>
                <ul className="list-disc list-inside font-sans text-gray-600 text-base/7 bg-neutral-50 rounded-lg py-2">
                  {steps.map((step, index) => (
                    <li key={index} className="px-3 py-1 rounded-lg">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
