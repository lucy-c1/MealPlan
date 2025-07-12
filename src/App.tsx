import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MealPlan from "./pages/MealPlan";
import RecipeSearch from "./pages/RecipeSearch";
import Login from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RecipeSearch />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/plan",
    element: <MealPlan />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
