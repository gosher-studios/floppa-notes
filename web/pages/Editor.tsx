import React, { useState, useEffect, useContext,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context";

const Editor = () => {
  const { id } = useParams();
  const edit  = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [note, setNote] = useState({ loading: true });
  const [status, setStatus] = useState("opened");
  
  const handleChange = (e) => {
    edit.current.innerHTML = parse(e.target.innerText);
    // edit.current.innerHTML = parse(edit.current.innerText)
    console.log(edit.current.innerHTML);
  }
  
  
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

  // const handleLines = (e) => {
    
  //   const sel = window.getSelection();
  //   const node = sel.focusNode;
  //   const offset = sel.focusOffset;
  //   const pos = getCursor(editor.current, node, offset, { pos: 0, done: false });
  //       editor.current.innerHTML = parse(editor.current.innerText);
    
  //   sel.removeAllRanges();
  //   const range = setCursor(editor.current, document.createRange(), {
  //     pos: pos.pos,
  //     done: false,
  //   });
  //   range.collapse(true);
  //   sel.addRange(range);
  // };

  // const getCursor = (parent, node, offset, stat) => {
  //   if (stat.done) return stat;

  //   let currentNode = null;
  //   if (parent.childNodes.length == 0) {
  //     stat.pos += parent.textContent.length;
  //     console.log(parent);
  //   } else {
  //     for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
  //       currentNode = parent.childNodes[i];
  //       if (currentNode === node) {
  //         stat.pos += offset;
  //         stat.done = true;
  //         return stat;
  //       } else getCursor(currentNode, node, offset, stat);
  //     }
  //   }
  //   return stat;
  // };
  
  const parse = (text) => {
    return (
    text
      .replace(/\*{2}(.*?)\*{2}/gm, "**<strong>$1</strong>**") // bold
      .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/gm, "*<em>$1</em>*") // italic
      // handle special characters
      .replace(/\n/gm, "<br /> ")
      .replace(/\t/gm, "&#9;")
  );
  };

  // const setCursor = (parent, range, stat) => {
  //   if (stat.done) return range;

  //   if (parent.childNodes.length == 0) {
  //     if (parent.textContent.length >= stat.pos) {
  //       range.setStart(parent, stat.pos);
  //       stat.done = true;
  //     } else {
  //       stat.pos = stat.pos - parent.textContent.length;
  //     }
  //   } else {
  //     for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
  //       currentNode = parent.childNodes[i];
  //       setCursor(currentNode, range, stat);
  //     }
  //   }
  //   return range;
  // };

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
          className="absolute left-2 text-2xl font-bold cursor-pointer hover:text-purple transition-colors"
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
        <p className="text-lightgrey ml-2 text-sm">{status}</p>
      </div>
      {/* <textarea
        value={note.content}
        onChange={(e) => {setNote({ ...note, ...{ content: e.target.value } })}
        className="resize-none outline-none bg-grey  p-4 text-base flex-1"
      /> */}
      <div
        ref={edit}
        className="resize-none outline-none bg-grey p-4 text-base flex-1  w-fill overflow-y-auto overflow-x-none whitespace-pre "
        contentEditable="true"
        onInput={(e) => handleChange(e)}
        suppressContentEditableWarning={true}
    
      ></div>
    </div>
  );
};

export default Editor;
