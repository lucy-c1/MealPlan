import { Bookmark, Calendar, User, Search, ChefHat } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export type HeaderProps = {
  activePage: "search" | "plan" | "saved";
};

export default function Header({ activePage }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-xl text-gray-900">MealPlan</p>
          <p className="text-xs text-gray-500">Delicious recipes, planned perfectly</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
            activePage === "search"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          onClick={() => {
            if (activePage !== "search") {
              navigate("/");
            }
          }}
        >
          <Search className="w-4 h-4" />
          Recipe Search
        </button>

        <button
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
            activePage === "plan"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          onClick={() => {
            if (activePage !== "plan") {
              navigate("/plan");
            }
          }}
        >
          <Calendar className="w-4 h-4" />
          Meal Planner
        </button>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200",
              activePage === "saved"
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => {
              if (activePage !== "saved") {
                navigate("/saved");
              }
            }}
            aria-label="Saved Recipes"
            type="button"
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Recipes</span>
          </button>
        )}

        {/* Profile Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{user?.email}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
