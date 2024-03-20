import { useState } from "react";
import "./folder.css"

const Folder = ({ explorer, isParentOpen, isRoot=false }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  if(explorer.name === ".DS_Store") return;
  if (explorer.isFolder) {
    return (
      <div className="explorer">
        <span id={isRoot ? "selected" : ""} data-toggle={isParentOpen} data-isfolder={true} onClick={() => setIsVisible(!isVisible)}>
          📁 {explorer.name}
        </span>
        <div  className={ isVisible ? "block" : "none"}>
          {explorer.items.map((exp) => (
          <Folder key={exp.id} explorer={exp} isParentOpen={isVisible}/>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="explorer">
        <span data-toggle={isParentOpen} data-isfolder={false}> 📄 {explorer.name}</span>
      </div>)
  }
}

export default Folder;
