import React, { useState, useEffect, useContext,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import ReactMarkdown from 'react-markdown'
const Editor = () => {
  const { id } = useParams();
  const edit  = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [note, setNote] = useState({ loading: true });
  const [status, setStatus] = useState("opened");
  const [cursor,setCursor] = useState(0);
  
  useEffect(() => {
    if (!user.loading) {
      if (user.token) {
        fetch("http://localhost:4040/notes/" + id, {
          headers: { Authorization: "Bearer " + user.token },
        })
          .then((res) => res.json())
          .then((note) =>
            setNote({
              loading: false,
              title: note.title,
              content: note.content,
            })
          )
          .catch(() => navigate("/"));
      } else {
        navigate("/");
      }
    }
  }, [user]);
   
  handleEdit = (e) => {
    switch(e.key) {
    case "Backspace" : 
        const fuck = note.content.replace(/<[^>]*>?/gm, '').slice(0,-1)
        setNote({...note,...{content: parse(fuck)}});
        break;
    case "Enter" :
          setNote({...note,...{content:note.content + "<br />"}})
          break;
    case "Shift" :
      console.log("shit");
          break;
    case "Meta" :
      console.log("shit");
          break;
     case "Alt" :
      console.log("shit");
          break;
    default:
      setNote({...note,...{content: parse(note.content + e.key)}})
      
  }
  }
   const parse = (text) => {
    return (
    text
      .replace(/\*{2}(.*?)\*{2}/gm, "**<strong>$1</strong>**") // bold
      .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/gm, "*<em>$1</em>*") // italic
  );
  };
  
  useEffect(() => {
    //probably should time this
    if (!note.loading) {
      setStatus("saving...");
      fetch("http://localhost:4040/notes/" + id, {
        headers: { Authorization: "Bearer " + user.token },
        method: "POST",
        body: JSON.stringify({ content: note.content, title: note.title }),
      }).then(() => setStatus("saved"));
    }
  }, [note]);

  return note.loading ? (
    <p>loading</p>
  ) : (
    <div className="w-[1024px] flex flex-col h-screen">
      <title>{note.title}</title>
      <div className="flex justify-center items-center relative py-2">
        <h1
          className="absolute left-2 text-2xl font-bold cursor-pointer hover:text-purple transition-colors select-none"
          onClick={() => navigate("/")}
        >
          Floppa Notes
        </h1>
        <p
          contentEditable="true"
          className="px-1"
          onBlur={(e) => {
            setNote({ ...note, ...{ title: e.target.innerHTML } });
          }}
        >
          {note.title}
        </p>
        <p className="text-lightgrey ml-2 text-sm select-none">{status}</p>
      </div>
    
      <div className="resize-none outline-none bg-grey p-4 text-base flex-1 overflow-none" tabIndex={0} onKeyDown={(e) => handleEdit(e)} dangerouslySetInnerHTML={{__html: note.content}} /> 
      {/* <textarea
        value={note.content}
        onChange={(e) => {setNote({ ...note, ...{ content: e.target.value } })}
        className="resize-none outline-none bg-grey  p-4 text-base flex-1"
      /> */}
               </div>
  );
};

export default Editor;
