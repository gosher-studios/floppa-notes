import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "react-feather";

import { UserContext } from "../context";
import { Button } from "../components";

const Editor = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [note, setNote] = useState({ loading: true });

  useEffect(() => {
    fetch("http://localhost:4040/notes/63540d06286474eb3e2558a0", {
      headers: { Authorization: "Bearer " + user.token },
    })
      .then((res) => res.json())
      .then((note) =>
        setNote({ loading: false, title: note.title, content: note.content })
      );
  }, []);
  console.log(note);

  return (
    <div className="w-[1024px] flex flex-col">
      {note.loading ? (
        <p>loading</p>
      ) : (
        <>
          <div className="flex justify-center items-center relative py-2">
            <h1
              className="absolute left-2 text-2xl font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              Floppa Notes
            </h1>
            <p>{note.title}</p>
            <p className="text-accent ml-2 text-sm">idk</p>
            <Button Icon={Save} onClick={() => {}} className="absolute right-0">
              Save
            </Button>
          </div>
          <textarea
            value={note.content}
            onChange={(e) =>
              setNote({ ...note, ...{ content: e.target.value } })
            }
            className="resize-none outline-none bg-editor h-48 p-4 text-base rounded flex-1"
          />
        </>
      )}
    </div>
  );
};

export default Editor;
