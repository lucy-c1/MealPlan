import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function RecipeSearch() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="w-full">
      <Header isSearchPage={true} />
      <div>
        <h1 className="text-4xl font-bold">{message}</h1>
      </div>
    </div>
  );
}
