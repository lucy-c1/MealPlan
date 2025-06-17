import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/api";

export default function RecipeSearch() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRecipe()
  }, []);

  async function getRecipe() {
    const data = await api.getRandomRecipes()
    console.log(data)
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header isSearchPage={true} />

      <div className="flex w-full flex-1">
        {/* Filters section */}
        <div className="h-full flex flex-col w-[25%] py-8 px-4 border-r-2 border-orange-800">
          <p className="text-base font-medium">Filters</p>
        </div>
        {/* Search Section */}
        <div className="flex flex-col px-12 py-8">
          <p>Search</p>
        </div>
      </div>
    </div>
  );
}
