import React, { useContext } from "react";
import { GitHub, LogOut } from "react-feather";

import { Button } from "../components";
import { UserContext } from "../context";

const Account = () => {
  const user = useContext(UserContext);

  return (
    <div className="space-y-2">
      <h2 className="font-bold text-3xl">Account:</h2>
      <div className="flex items-center space-x-4">
        <p className="text-xl">
          <span className="font-bold">{user.username}</span>
          <br />
          Linked with GitHub.
        </p>
        <img className="w-16 rounded-full" src={user.avatar} />
        <GitHub className="w-16 h-auto" />
      </div>
      <Button
        Icon={LogOut}
        onClick={() => {
          localStorage.removeItem("token");
          location.reload();
        }}
      >
        Signout
      </Button>
    </div>
  );
};

export default Account;
