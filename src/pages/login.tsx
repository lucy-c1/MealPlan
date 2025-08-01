import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Calendar, Bookmark, Search, Sparkles } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
      {/* Left - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900">MealPlan</h1>
              <p className="text-sm text-gray-500">Delicious recipes, planned perfectly</p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                {mode === "login" ? "Welcome back!" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {mode === "login"
                  ? "Sign in to access your meal plans and saved recipes"
                  : "Join thousands of users planning their meals with ease"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LoginForm mode={mode} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                        onClick={() => setMode("signup")}
                      >
                        Sign up
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                        onClick={() => setMode("login")}
                      >
                        Log in
                      </Button>
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right - Feature Showcase */}
      <div className="w-1/2 bg-white border-l border-gray-200 flex items-center justify-center p-12">
        <div className="max-w-lg">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plan Your Meals Like a Pro
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover recipes, create meal plans, and simplify your week with smarter meal prep and planning.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Recipe Search</h3>
                <p className="text-sm text-gray-600">Find thousands of delicious recipes from around the world</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Meal Planning</h3>
                <p className="text-sm text-gray-600">Plan your week with our intuitive drag-and-drop interface</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <Bookmark className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Save Favorites</h3>
                <p className="text-sm text-gray-600">Keep your favorite recipes organized and easily accessible</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Suggestions</h3>
                <p className="text-sm text-gray-600">Get personalized meal ideas based on your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
