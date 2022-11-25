import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, Plus, Share2, Edit2 } from "react-feather";

import { Layout } from "../components";
import { UserContext } from "../context";

const Home = () => {
  const user = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // useEffect(() => {
  //   if (!user.loading) {
  //     if (user.token) {
  //       fetch("http://localhost:4040/notes", {
  //         headers: { Authorization: "Bearer " + user.token },
  //       })
  //         .then((res) => res.json())
  //         .then((notes) => setNotes(notes));
  //     }
  //   }
  // }, [user]);

  const createNote = () => {
    fetch("http://localhost:4040/notes", {
      method: "POST",
      headers: { Authorization: "Bearer " + user.token },
    })
      .then((res) => res.text())
      .then((id) => navigate("/editor/" + id));
  };

  const renameNote = (id, title) => {
    fetch("http://localhost:4040/notes/" + id, {
      headers: { Authorization: "Bearer " + user.token },
      method: "POST",
      body: JSON.stringify({ title: title }),
    }).then(() => console.log(title, id));
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    fetch("http://localhost:4040/notes/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + user.token },
    });
    setNotes(notes.filter((n) => n._id !== id));
  };

  const Note = ({ note }) => {
    return (
      <div
        className="w-full transition-colors hover:bg-grey p-2 cursor-pointer flex items-center border-grey border-b-2"
        onClick={() => navigate("/editor/" + note._id)}
      >
        <span
          className="font-bold hover:outline outline-darkgrey px-2 rounded-sm  "
          contentEditable="true"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onBlur={(e) => {
            renameNote(note._id, e.target.value);
          }}
        >
          {note.title}
        </span>
        <span className="flex-1" />
        <Trash
          className="transition-all hover:text-purple hover:scale-125"
          onClick={(e) => deleteNote(e, note._id)}
        />
      </div>
    );
  };

  return (
    <Layout>
      {user.token ? (
        <>
          <div className="w-full transition-colors hover:bg-grey  cursor-pointer flex items-center border-grey border-b-2 mb-8">
            <input
              type="text"
              className="bg-transparent border-b-2 border-lightgrey w-full outline-none px-2"
              placeholder="Search Your Notes..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>

          <h2 className="text-2xl font-bold">Your Notes:</h2>
          <div className="outline outline-2 outline-grey my-2">
            {search
              ? notes
                  .filter((note) => note.title.includes(search))
                  .map((note) => <Note key={note._id} note={note} />)
              : notes.map((note) => <Note key={note._id} note={note} />)}
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
        <div className="p-4 bg-grey rounded-lg text-2xl">
          <h1 className="text-5xl mb-2 font-bold">
            <span className="text-lightgrey">#</span> Floppa Notes
          </h1>
          <p>
            the{" "}
            <b>
              <span className="text-lightgrey">**</span>fucking
              <span className="text-lightgrey">**</span>
            </b>{" "}
            note taking app.
          </p>
          <p>blazingly fast 🚀🚀 🔥🔥</p>
        </div>
      )}
    </Layout>
  );
};

export default Home;
