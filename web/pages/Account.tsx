import React, { useContext } from "react";
import { LogOut } from "react-feather";

import { UserContext } from "../context";
import { Layout, Button } from "../components";

const Account = () => {
  const user = useContext(UserContext);

  return (
    <Layout authenticated>
      <div className="space-y-2">
        <h2 className="font-bold text-3xl">Account:</h2>
        <div className="flex items-center space-x-4">
          <img className="w-16 rounded-md" src={user.avatar} />
          <p className="text-xl">
            <span className="font-bold">{user.username}</span>
            <br />
            Linked with GitHub.
          </p>
        </div>
        <Button
          Icon={LogOut}
          onClick={() => {
            localStorage.removeItem("token");
            location.reload();
          }}
        >
          Sign out
        </Button>
      </div>
    </Layout>
  );
};

export default Account;
