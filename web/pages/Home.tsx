import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components";
import { UserContext } from "../context";
const Home = () => {
  const user = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loading) {
      if (user.token) {
        fetch("http://localhost:4040/notes", {
          headers: { Authorization: "Bearer " + user.token },
        })
          .then((res) => res.json())
          .then((notes) => setNotes(notes));
      }
    } else {
    }
  }, [user]);

  return (
    <Layout>
      <div className="w-full h-fit">
        {notes.map((not, i) => (
          <div
            key={i}
            className="w-full h-fit p-2  "
            onClick={() => navigate("/editor" + not._id)}
          >
            <span className="text-bold">{not.title}</span>
            <span className="w-2  ml-2 truncate text-lightgrey">
              {not.content}
            </span>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
