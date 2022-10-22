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
import { Home, Account, Editor } from "./pages";
import { Layout } from "./components";

const LoginCallback = () => {
  const [params] = useSearchParams();
  localStorage.setItem("token", params.get("token"));
  location.replace("/");
  return <></>;
};

const authenticated = (user, element: React.ReactNode) =>
  user.token ? element : <Navigate to="/" />;

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
        <div className="w-screen min-h-screen flex justify-center bg-bg text-white text-lg font-switzer">
          {user.loading ? (
            <Layout>loading</Layout>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/callback" element={<LoginCallback />} />
              <Route path="/editor" element={authenticated(user, <Editor />)} />
              <Route
                path="/account"
                element={authenticated(user, <Account />)}
              />
            </Routes>
          )}
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<App />);
