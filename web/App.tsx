import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";
import { GitHub } from "react-feather";

const GITHUB_ID = "078e05c80c0d659c7507";
const GITHUB_REDIRECT = "http://localhost:4040/auth/callback";

const Home = () => {
  return (
    <button
      className="px-2 py-1 border-2 transition-colors hover:border-purple rounded-md flex items-center font-bold"
      onClick={() =>
        window.location.replace(
          "https://github.com/login/oauth/authorize?client_id=" + GITHUB_ID
        )
      }
    >
      <GitHub className="mr-1" />
      Login with GitHub
    </button>
  );
};

const Callback = () => {
  const [params] = useSearchParams();
  return <h1>{params.get("token")}</h1>;
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="w-screen h-screen flex justify-center bg-bg text-white text-lg font-switzer">
        <div className="p-4 w-full lg:w-[1024px]">
          <header className="text-4xl mb-8">
            <h1 className="font-bold">Floppa Notes</h1>
            <div className="absolute left-0 mt-4 w-screen h-[2px] bg-gradient-to-r from-purple via-blue via-cyan to-green" />
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<App />);
