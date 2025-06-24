import { useState } from "react";
import type { Recipe } from "../types/type";
import RecipeDetailsPopup from "./RecipeDetailsPopup";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  // for the recipe details popup
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div key={recipe.name}>
        <img
          alt=""
          src={recipe.imageUrl}
          className="aspect-3/2 w-full rounded-2xl object-cover"
        />
        <h3
          title="Click for more recipe info"
          className="mt-6 text-lg/8 font-semibold text-gray-900 cursor-pointer inline-flex hover:text-gray-600"
          onClick={() => setOpen(true)}
        >
          {recipe.name}
        </h3>
        <p className="text-base/7 text-gray-600">Area: {recipe.area}</p>
        <p className="text-base/7 text-gray-600">Category: {recipe.category}</p>
        <div className="flex justify-between mt-2">
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
          {recipe?.youtubeUrl && (
            <div className="flex cursor-pointer flex-col justify-end mb-1">
              <ul role="list" className="flex gap-x-6">
                <li>
                  <a
                    className="text-gray-400 hover:text-gray-500"
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-400 hover:text-gray-500"
                    >
                      <title>YouTube</title>
                      <path
                        fill="currentColor"
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* hidden until name is clicked */}
      <RecipeDetailsPopup open={open} setOpen={setOpen} recipe={recipe} />
    </div>
  );
}
