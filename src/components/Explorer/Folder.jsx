import { useState } from "react";
import "./folder.css"

import openFolder from "./svgs/openFolder.svg";
import closeFolder from "./svgs/closeFolder.svg";
import file from "./svgs/file.svg"

const Folder = ({ explorer, isParentOpen, isRoot=false }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  if(explorer.name === ".DS_Store") return;
  if (explorer.isFolder) {
    return (
      <div className="explorer">
        <span className="folder__span"  id={isRoot ? "selected" : ""} data-toggle={isParentOpen} data-isfolder={true} onClick={() => setIsVisible(!isVisible)}>
          <img className="svg" src={isVisible ? openFolder : closeFolder} alt="folder logo"/> {explorer.name}
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
        <span className="folder__span" data-toggle={isParentOpen} data-isfolder={false} data-id={explorer.id}>
          <img className="svg" src={file} alt="file logo"/> {explorer.name}
        </span>
      </div>)
  }
}

export default Folder;
