import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";

import { UserContext } from "./context";
import { Home } from "./pages";

const LoginCallback = () => {
  const [params] = useSearchParams();
  localStorage.setItem("token", params.get("token"));
  location.replace("/");
};

const App = () => {
  const [user, setUser] = useState({ loading: true });

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      fetch("https://api.github.com/user", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then((user) =>
          setUser({ loading: false, username: user.login, id: user.id })
        );
    } else {
      setUser({ loading: false, username: null });
    }
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <div className="w-screen h-screen flex justify-center bg-bg text-white text-lg font-switzer">
          <div className="p-4 w-full lg:w-[1024px]">
            <header className="text-4xl mb-8">
              <h1 className="font-bold">Floppa Notes</h1>
              <div className="absolute left-0 mt-4 w-screen h-[2px] bg-gradient-to-r from-purple via-blue via-cyan to-green" />
            </header>
            {user.loading ? (
              <p>loading</p>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/callback" element={<LoginCallback />} />
              </Routes>
            )}
          </div>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<App />);
