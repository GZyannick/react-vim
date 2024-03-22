import { useRef, useState, useEffect } from "react"
import Folder from "./Folder"
import { handleExplorerKeys } from "../../utils/explorerCommands";


const FolderStructur = ({ folderStruct, setIsVimInit }) => {
  const folderStructurRef = useRef()
  const handleKeyDown = (e) => {
    if (!folderStructurRef.current) return
    //TODO remove querySelectorAll causing bug with page reload
    let spans = folderStructurRef.current.querySelectorAll('[data-toggle="true"]')
    handleExplorerKeys(e, spans, setIsVimInit);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [])


  return (
    <div ref={folderStructurRef}>
      <Folder explorer={folderStruct} isParentOpen={true} isRoot={true} />
    </div>
  )
}

export default FolderStructur
