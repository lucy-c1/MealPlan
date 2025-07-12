import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left */}
      <div className="bg-white w-1/2 flex flex-col h-full items-center justify-center">
        <div className="flex flex-col gap-10 w-full max-w-md px-4">
          <p className="text-3xl text-orange-800 font-bold">MealPlan</p>

          <p className="text-xl text-orange-800 font-medium">
            Add description here
          </p>

          <LoginForm />
        </div>
      </div>

      {/* Right */}
      <div className="bg-neutral-200 w-1/2"></div>
    </div>
  );
}
