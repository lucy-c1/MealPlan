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

          <form className="flex flex-col gap-6 w-full mt-10">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-orange-800 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right */}
      <div className="bg-neutral-200 w-1/2"></div>
    </div>
  );
}
