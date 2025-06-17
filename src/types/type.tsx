const areas = [
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "Filipino",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Ukrainian",
  "Uruguayan",
  "Vietnamese",
] as const;

const categories = [
  "Beef",
  "Chicken",
  "Goat",
  "Lamb",
  "Pork",
  "Seafood",
  "Pasta",
  "Miscellaneous",
  "Vegan",
  "Vegetarian",
  "Side",
  "Starter",
  "Dessert",
  "Breakfast",
] as const;

type Category = (typeof categories)[number];

type Area = (typeof areas)[number];

type RecipeIngredient = {
  name: string;
  amount: string;
};

type Recipe = {
  id: string;
  name: string;
  area: Area;
  category: Category;
  ingredients: RecipeIngredient[]
  instructions: string // change to string[] later, with each element representing one step
  imageUrl: string
  tags: string[]
  youtubeUrl?: string
};

export type {
    Category,
    Area,
    RecipeIngredient,
    Recipe,
}

export {
    categories,
    areas
}