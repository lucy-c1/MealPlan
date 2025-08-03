import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MealPlan from "./pages/MealPlan";
import RecipeSearch from "./pages/RecipeSearch";
import Login from "./pages/login";
import { AuthProvider } from "./AuthContext";
import SavedRecipes from "./pages/savedRecipes";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RecipeSearch />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/plan",
    element: (
      <ProtectedRoute>
        <MealPlan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/saved",
    element: (
      <ProtectedRoute>
        <SavedRecipes />
      </ProtectedRoute>
    ),
  },
]);

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
