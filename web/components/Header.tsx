import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GitHub } from "react-feather";

import { UserContext } from "../context";
import { Button } from "../components";
import { GITHUB_ID } from "../config";

const Header = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header className="mb-10 flex items-center">
      <h1
        className="font-bold text-4xl cursor-pointer transition-colors hover:text-purple"
        onClick={() => navigate("/")}
      >
        Floppa Notes
      </h1>
      <span className="flex-1" />
      {!user.loading &&
        (user.avatar ? (
          <img
            className="w-10 rounded-full cursor-pointer"
            src={user.avatar}
            onClick={() => navigate("/account")}
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
  );
};

export default Header;
