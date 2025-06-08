import { Calendar, UserCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export type HeaderProps = {
  isSearchPage: boolean;
};

export default function Header({ isSearchPage }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-8 py-4 border-b-2 border-orange-800">
      <div className="flex items-center gap-1">
        <p className="font-medium text-base">Meal Planner</p>
        <Calendar className="w-5 h-5" />
      </div>
      <div className="flex text-base font-medium">
        <div
          className={cn(
            "border-r-2 border-black px-4 py-2",
            isSearchPage && "rounded-l bg-orange-700 text-white cursor-default",
            !isSearchPage && "cursor-pointer hover:bg-neutral-100 rounded-1"
          )}
          onClick={() => {
            if (!isSearchPage) {
              navigate("/");
            }
          }}
        >
          Recipe Search
        </div>
        <div
          className={cn(
            "px-4 py-2",
            isSearchPage && "cursor-pointer hover:bg-neutral-100 rounded-r",
            !isSearchPage && "rounded-r bg-orange-700 text-white cursor-default"
          )}
          onClick={() => {
            if (isSearchPage) {
              navigate("/plan");
            }
          }}
        >
          Meal Planner
        </div>
      </div>
      <div>
        <UserCircle className="w-5 h-5" />
      </div>
    </div>
  );
}
