import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import {Info} from "react-feather";
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
  const [modal, setModal] = useState(true);
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
        <div className="w-screen min-h-screen flex justify-center bg-darkgrey  text-white text-lg font-switzer">
          {modal ? (
            <></>
          ) : (
            <div
              className="fixed w-full h-full z-40 flex justify-center items-center bg-opacity-50 bg-grey"
              onClick={() => {
                setModal(!modal);
              }}
            >
              <div className="h-128 w-192 bg-darkgrey z-50 flex flex-col text-4xl rounded-xl relative">
                <span className="m-4">
                  <h1>About Floppa Notes!!</h1>
                  <h2 className="text-3xl mt-4">Powered By</h2>
                  <ul className="text-2xl list-disc mx-12">
                    <li>React</li>
                    <li>Rust</li>
                    <li>MongoDB</li>
                    <li>pseudocode</li>
                    <li>child labour</li>
                  </ul>
                  <a
                    className="text-xl text-blue underline bottom-16 absolute"
                    href="https://github.com/gosher-studios/floppa-notes"
                  >
                    repository
                  </a>
                </span>
                <div className="text-xl bottom-2 absolute m-4">
                  made with 🔥 & 😢 by <a className="text-blue underline" href="https://github.com/chxry">
                    Alexander Tahiri
                  </a>
                  {' '} & {' '} 
                  <a
                    className="text-blue underline"
                    href="https://github.com/pandaroses"
                  >
                    Gosha Tnimov</a></div>
              </div>
            </div>
          )}
          <div
            className="w-12 h-12 fixed left-2 bottom-2  hover:scale-110 transition duration-150 z-10 flex items-center justify-center"
            onClick={() => {
              setModal(!modal);
            }}
          >
            <Info className=" overflow-none rounded-md" size={30} />
          </div>
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
