import "./Page.css";
import { useState, useEffect } from "react";
import Prompts from "../Prompts/Prompts";
import Vim from "../Vim/Vim.jsx";
import { openDirectoryInstance, initFolderData } from "../../utils/fsa";
const Page = () => {
  const [rootDirectory, setRootDirectory] = useState();
  const [currentDirectory, setCurrentDirectory] = useState();
  const [isFileSystemOpen, setIsFileSystemOpen] = useState(false);
  const [vimHandler, setVimHandler] = useState({
    isOpen: false,
    fileOrDirectory: undefined,
    isFolder: false,
  });

  useEffect(() => {
    if (!isFileSystemOpen) return;
    const fetchDir = async () => {
      const dirHandle = await openDirectoryInstance();

      if (dirHandle) {
        const folderData = await initFolderData(dirHandle);
        setRootDirectory(folderData);
        setCurrentDirectory(folderData);
      }
    };
    fetchDir();
    setIsFileSystemOpen(false);
  }, [isFileSystemOpen]);

  if (vimHandler.isOpen) {
    return (
      <>
        <Vim
          vimHandler={vimHandler}
          setVimHandler={setVimHandler}
          setIsFileSystemOpen={setIsFileSystemOpen}
        />
      </>
    );
  } else {
    return (
      <>
        <Prompts
          rootDirectory={rootDirectory}
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
          setIsFileSystemOpen={setIsFileSystemOpen}
          setVimHandler={setVimHandler}
        />
      </>
    );
  }
};

export default Page;
