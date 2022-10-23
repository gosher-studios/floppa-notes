import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context";

const NOTE = "63540d06286474eb3e2558a0";

const Editor = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [note, setNote] = useState({ loading: true });
  const [status, setStatus] = useState("opened");

  useEffect(() => {
    if (!user.loading) {
      if (user.token) {
        fetch("http://localhost:4040/notes/" + NOTE, {
          headers: { Authorization: "Bearer " + user.token },
        })
          .then((res) => res.json())
          .then((note) =>
            setNote({
              loading: false,
              title: note.title,
              content: note.content,
            })
          );
      } else {
        navigate("/");
      }
    }
  }, [user]);
  console.log(note);

  useEffect(() => {
    //probably should time this
    if (!note.loading) {
    }
    setStatus("saving...");
    fetch("http://localhost:4040/notes/" + NOTE, {
      headers: { Authorization: "Bearer " + user.token },
      method: "POST",
      body: JSON.stringify({ content: note.content }),
    }).then(() => setStatus("saved"));
  }, [note]);

  return note.loading ? (
    <p>loading</p>
  ) : (
    <div className="w-[1024px] flex flex-col">
      <div className="flex justify-center items-center relative py-2">
        <h1
          className="absolute left-2 text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Floppa Notes
        </h1>
        <p>{note.title}</p>
        <p className="text-lightgrey ml-2 text-sm">{status}</p>
      </div>
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, ...{ content: e.target.value } })}
        className="resize-none outline-none bg-grey h-48 p-4 text-base rounded flex-1"
      />
    </div>
  );
};

export default Editor;
