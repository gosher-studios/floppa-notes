import React from "react";
import { createRoot } from "react-dom/client";
import { GitHub } from "react-feather";

const GITHUB_ID = "d63848aa7efdbcd50796";
const GITHUB_REDIRECT = "http://localhost:4040/auth/callback";

const App = () => {
  return (
    <div className="w-screen h-screen flex justify-center bg-bg text-white text-lg font-switzer">
      <div className="p-4 w-full lg:w-[1024px]">
        <header className="text-4xl mb-8">
          <h1 className="font-bold">Floppa Notes</h1>
          <div className="absolute left-0 mt-4 w-screen h-[2px] bg-gradient-to-r from-purple via-blue via-cyan to-green" />
        </header>
        <button
          className="px-2 py-1 border-2 transition-colors hover:border-purple rounded-md flex items-center font-bold"
          onClick={() =>
            window.open(
              "https://github.com/login/oauth/authorize?client_id=" + GITHUB_ID
            )
          }
        >
          <GitHub className="mr-1" />
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
