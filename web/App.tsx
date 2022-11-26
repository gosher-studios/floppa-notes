import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { Info } from "react-feather";
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
  const [modal, setModal] = useState(false);

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
          {!modal ? (
            <></>
          ) : (
            <div
              className="fixed inset-0 flex justify-center items-center bg-opacity-75 bg-darkgrey"
              onClick={() => {
                setModal(!modal);
              }}
            >
              <div className="h-128 w-192 bg-grey z-50 rounded-lg shadow-2xl p-6 relative">
                <h1 className="font-bold text-4xl flex items-center">
                  <Info className="mr-2" i size={32} />
                  About Floppa Notes
                </h1>
                <p className="text-xl">Powered by:</p>🤓
                <br />
                🪦
                <br />
                🇦🇱
                <br />
                <p className="absolute bottom-6">
                  made with 😢 by alex t and gosha t
                </p>
              </div>
            </div>
          )}
          <Info
            className="fixed left-4 bottom-4 cursor-pointer transition-transform hover:scale-105"
            onClick={() => setModal(true)}
            color="#ccc"
          />
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
