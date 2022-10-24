import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, Plus, Share2 } from "react-feather";

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
    }
  }, [user]);

  const createNote = () => {
    fetch("http://localhost:4040/notes", {
      method: "POST",
      headers: { Authorization: "Bearer " + user.token },
    })
      .then((res) => res.text())
      .then((id) => navigate("/editor/" + id));
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    fetch("http://localhost:4040/notes/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + user.token },
    });
    setNotes(notes.filter((n) => n._id !== id));
  };

  return (
    <Layout>
      {user.token ? (
        <>
          <h2 className="text-2xl font-bold">Your Notes:</h2>
          <div className="outline outline-2 outline-grey my-2">
            {notes.map((note) => (
              <div
                key={note._id}
                className="w-full transition-colors hover:bg-grey px-4 py-2 cursor-pointer flex items-center border-grey border-b-2"
                onClick={() => navigate("/editor/" + note._id)}
              >
                <span className="font-bold flex-1">{note.title}</span>
                <Trash
                  className="transition-all hover:text-purple hover:scale-125"
                  onClick={(e) => deleteNote(e, note._id)}
                />
              </div>
            ))}
            <button
              className="w-full transition-colors hover:bg-grey px-4 py-2 flex items-center font-bold"
              onClick={() => createNote()}
            >
              <Plus className="mr-2" />
              Create Note
            </button>
          </div>
          <h2 className="text-2xl font-bold flex items-center">
            <Share2 className="mr-2" />
            Shared with you:
          </h2>
          <p className="text-lightgrey">Nothing shared yet.</p>
        </>
      ) : (
        <p>not logged in</p>
      )}
    </Layout>
  );
};

export default Home;
