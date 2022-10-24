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
import { Home, Settings, Editor } from "./pages";

const LoginCallback = () => {
  const [params] = useSearchParams();
  localStorage.setItem("token", params.get("token"));
  location.replace("/");
  return <></>;
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
          setUser({
            loading: false,
            token,
            username: user.login,
            id: user.id,
            avatar: user.avatar_url,
          })
        );
    } else {
      setUser({ loading: false, token: null });
    }
  }, []);
  console.log(user);

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <div className="w-screen min-h-screen flex justify-center bg-darkgrey text-white text-lg font-switzer">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<LoginCallback />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<App />);
