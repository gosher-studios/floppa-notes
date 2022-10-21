import React, { useContext } from "react";
import { GitHub, LogOut } from "react-feather";

import { UserContext } from "../context";
import { Button } from "../components";
import { GITHUB_ID } from "../config";

const Home = () => {
  const user = useContext(UserContext);

  return user.username ? (
    <>
      <h1>hello {user.username}</h1>
      <Button
        Icon={LogOut}
        onClick={() => {
          localStorage.removeItem("token");
          location.reload();
        }}
      >
        Signout
      </Button>
    </>
  ) : (
    <Button
      Icon={GitHub}
      onClick={() =>
        location.replace(
          "https://github.com/login/oauth/authorize?client_id=" + GITHUB_ID
        )
      }
    >
      Login with GitHub
    </Button>
  );
};

export default Home;
