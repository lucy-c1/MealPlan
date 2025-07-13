import { Bookmark, Calendar, User } from "lucide-react";
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
    <div className="flex justify-between items-center px-8 py-4 border-b-2 border-orange-800">
      {/* Logo */}
      <div className="flex items-center gap-1">
        <p className="font-medium text-base">MealPlan</p>
        <Calendar className="w-5 h-5" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex text-base font-medium">
        <div
          className={cn(
            "border-r-2 border-black px-4 py-2",
            activePage === "search"
              ? "rounded-l bg-orange-700 text-white cursor-default"
              : "cursor-pointer hover:bg-neutral-100 rounded-l"
          )}
          onClick={() => {
            if (activePage !== "search") {
              navigate("/");
            }
          }}
        >
          Recipe Search
        </div>

        <div
          className={cn(
            "px-4 py-2",
            activePage === "plan"
              ? "cursor-default rounded-r bg-orange-700 text-white"
              : "cursor-pointer hover:bg-neutral-100 rounded-r"
          )}
          onClick={() => {
            if (activePage !== "plan") {
              navigate("/plan");
            }
          }}
        >
          Meal Planner
        </div>
      </div>

      {/* Saved Recipes Button */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-700",
              activePage === "saved"
                ? "bg-orange-700 text-white cursor-default"
                : "bg-white text-black hover:bg-neutral-100 cursor-pointer"
            )}
            onClick={() => {
              if (activePage !== "saved") {
                navigate("/saved");
              }
            }}
            aria-label="Saved Recipes"
            type="button"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved Recipes</span>
          </button>
        )}

        {/* Profile Avatar */}
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarFallback>
                <User className="w-6 h-6 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user?.email}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
