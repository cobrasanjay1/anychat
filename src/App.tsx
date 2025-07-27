import { useState } from "react";
import Chat from "./chat";

export default function App() {
  const [name, setName] = useState("");
  const [entered, setEntered] = useState(false);

  const handleEnter = () => {
    if (name.trim()) setEntered(true);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      {!entered ? (
        <div className="max-w-md mx-auto mt-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Enter your name</h1>
          <input
            type="text"
            className="border p-2 w-full rounded mb-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleEnter}
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <Chat sender={name} />
      )}
    </div>
  );
}
