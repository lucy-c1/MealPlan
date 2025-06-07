import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import MealPlan from './pages/MealPlan';
import RecipeSearch from './pages/RecipeSearch';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RecipeSearch />,
  },
  {
    path: "/plan",
    element: <MealPlan />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}