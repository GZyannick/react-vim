import { useRef, useState, useEffect } from "react"
import Folder from "./Folder"
import { movementKeybinds, openKeybinds } from "../../utils/explorerCommands";

const returnNewSelected = (children, isPrev) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i].id === "selected") {
      const currentChild = isPrev ? children[i - 1] : children[i + 1];
      if (!currentChild) return;
      currentChild.id = "selected";
      children[i].id = "";
      break
    }
  }
}

const FolderStructur = ({ folderStruct }) => {

  const folderStructurRef = useRef()
  const handleKeyDown = (e) => {
    if(!folderStructurRef.current) return
    let spans = folderStructurRef.current.querySelectorAll('[data-toggle="true"]')
    if (e.key in movementKeybinds) {
      e.preventDefault()
      returnNewSelected(spans, movementKeybinds[e.key]);
    }

    if (e.key in openKeybinds) {
      e.preventDefault();
      const selectedElement = document.querySelector("#selected");
      const isFolder = Boolean(selectedElement.dataset.isfolder);
      if(isFolder) selectedElement.click();
      // TODO if(isFile) open file in monaco ide 
    }

  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.addEventListener("keydown", handleKeyDown);
  },[]) 


  return (
      <div ref={folderStructurRef}>
        <Folder explorer={folderStruct} isParentOpen={true} isRoot={true} />
      </div>
  )
}

export default FolderStructur
