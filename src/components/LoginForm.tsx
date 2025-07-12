import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in!");
        toast.success("Logged in!");
        navigate("/")
      } else {
        // Signup flow
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save user info to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          // add other fields here if needed
        });

        console.log("Signed up and user saved!");
        toast.success("Account created!");
        navigate("/")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Auth error:", err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-orange-800 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition duration-200"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
