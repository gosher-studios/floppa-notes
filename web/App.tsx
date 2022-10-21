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
import { Home, Account } from "./pages";
import { Header } from "./components";

const LoginCallback = () => {
  const [params] = useSearchParams();
  localStorage.setItem("token", params.get("token"));
  location.replace("/");
  return <></>;
};

const authenticated = (user, element: React.ReactNode) =>
  user.username ? element : <Navigate to="/" />;

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
            username: user.login,
            id: user.id,
            avatar: user.avatar_url,
          })
        );
    } else {
      setUser({ loading: false, username: null });
    }
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <div className="w-screen h-screen flex justify-center bg-bg text-white text-lg font-switzer">
          <div className="p-5 w-full lg:w-[1024px]">
            <Header />
            {user.loading ? (
              <p>loading</p>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/callback" element={<LoginCallback />} />
                <Route
                  path="/account"
                  element={authenticated(user, <Account />)}
                />
              </Routes>
            )}
          </div>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<App />);
