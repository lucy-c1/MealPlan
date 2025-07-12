import { useState } from "react";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left */}
      <div className="bg-white w-1/2 flex flex-col h-full items-center justify-center">
        <div className="flex flex-col gap-10 w-full max-w-md px-4">
          <p className="text-3xl text-orange-800 font-bold">MealPlan</p>

          <div className="flex flex-col gap-1">
            <p className="text-xl text-orange-800 font-medium">
              {mode === "login" ? "Welcome back!" : "Welcome!"}
            </p>
            <p className="text-orange-800">
              {mode === "login"
                ? "Please login to your account."
                : "Please create a new account."}
            </p>
          </div>

          <LoginForm mode={mode} />

          <p className="text-sm text-gray-600 text-center">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-orange-700 font-semibold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-orange-700 font-semibold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="bg-neutral-200 w-1/2"></div>
    </div>
  );
}
