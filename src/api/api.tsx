const API_URL = "http://localhost:5000/";

function _urlFor(path: string) {
  return API_URL + path;
}

/**
 * Gets a random single recipe
 */
async function getRecipe() {
  const url = _urlFor("get-recipe");
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}

export default {
  getRecipe,
};
