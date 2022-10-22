import {React,useState} from "react";
import {Icon,Save} from "react-feather";
import {Button}  from "../components";
const Notes = () => {
    const [text, setText] = useState('');
    
    const handleText = event => {
    setText(event.target.value);
    console.log(event.target.value);
  };
      
    return (
    <div className="h-3/4">
      <textarea  id="txt" name="txt" value={text}  onChange={handleText} className="w-full h-full bg-transparent border-2 border-cyan rounded-sm"/>  
      <Button Icon={Save}
        onClick={() => {}}>
        what the fuck
      </Button>
    </div>
    
  );
};  


export default Notes;