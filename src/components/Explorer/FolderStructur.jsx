import { useRef, useEffect } from "react";
import Folder from "./Folder";
import { handleExplorerKeys } from "../../utils/explorerCommands";

const FolderStructur = ({
  vimHandler,
  setVimHandler,
  setIsVimInit,
  setFileId,
}) => {
  const folderStructurRef = useRef();
  let isLeavingMode = false;
  const folderQuitMode = () => {
    setVimHandler({
      isOpen: false,
      fileOrDirectory: undefined,
      isFolder: false,
    });
  };

  const handleKeyDown = (e) => {
    if (isLeavingMode && e.key === "q") {
      e.preventDefault();
      folderQuitMode();
      return;
    } else if (e.keyCode === 186 && !isLeavingMode) {
      isLeavingMode = true;
    } else {
      isLeavingMode = false;
    }

    if (!folderStructurRef.current) return;
    //TODO remove querySelectorAll causing bug with page reload
    let spans = folderStructurRef.current.querySelectorAll(
      '[data-toggle="true"]',
    );
    handleExplorerKeys(e, spans, setIsVimInit, setFileId);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div ref={folderStructurRef}>
        <Folder
          explorer={vimHandler.fileOrDirectory}
          isParentOpen={true}
          isRoot={true}
        />
      </div>
    </>
  );
};

export default FolderStructur;
