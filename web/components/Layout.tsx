import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GitHub } from "react-feather";

import { UserContext } from "../context";
import { Button } from "../components";
import { GITHUB_ID } from "../config";

const Layout = ({
  authenticated,
  children,
}: {
  authenticated?: boolean;
  children: React.ReactNode;
}) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="p-5 w-full lg:w-[1024px]">
      <title>Floppa Notes</title>
      <header className="mb-10 flex items-center">
        <h1
          className="font-bold text-4xl cursor-pointer transition-colors hover:text-purple duration-200 select-none"
          onClick={() => navigate("/")}
        >
          Floppa Notes
        </h1>
        <span className="flex-1" />
        {!user.loading &&
          (user.token ? (
            <img
              className="w-10 rounded-md cursor-pointer transition-all outline-purple duration-150 hover:outline select-none outline-2 hover:scale-105"
              src={user.avatar}
              onClick={() => navigate("/settings")}
            />
          ) : (
            <Button
              Icon={GitHub}
              onClick={() =>
                location.replace(
                  "https://github.com/login/oauth/authorize?client_id=" +
                    GITHUB_ID
                )
              }
            >
              Login with GitHub
            </Button>
          ))}
        <div className="absolute left-0 top-20 w-screen h-[2px] bg-gradient-to-r from-purple via-blue via-cyan to-green" />
      </header>
      {authenticated && user.loading ? (
        <p>loading</p>
      ) : !authenticated || user.token ? (
        children
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
};

export default Layout;
