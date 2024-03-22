import "./Page.css";
import { useState, useEffect } from "react";
import Prompts from "../Prompts/Prompts";
import Vim from "../Vim/Vim.jsx"
import { openDirectoryInstance, initFolderData } from '../../utils/fsa';
const Page = () => {
  const [rootDirectory, setRootDirectory] = useState();
  const [currentDirectory, setCurrentDirectory] = useState();
  const [isFileSystemOpen, setIsFileSystemOpen] = useState(false);
  const [isVimOpen, setIsVimOpen] = useState(false);

  useEffect(() => {
    if (!isFileSystemOpen) return;
    const fetchDir = async () => {
      const dirHandle = await openDirectoryInstance();

      if (dirHandle) {
        const folderData = await initFolderData(dirHandle);
        setRootDirectory(folderData);
        setCurrentDirectory(folderData)
      }
    }
    fetchDir();
    setIsFileSystemOpen(false);
  }, [isFileSystemOpen])


  if (isVimOpen) {
    return (
      <>
        <Vim
          rootDirectory={rootDirectory}
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
          setIsFileSystemOpen={setIsFileSystemOpen}
          setIsVimOpen={setIsVimOpen}
        />
      </>
    )
  } else {
    return (
      <>
        <Prompts
          rootDirectory={rootDirectory}
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
          setIsFileSystemOpen={setIsFileSystemOpen}
          setIsVimOpen={setIsVimOpen}
        />
      </>
    )
  }
}

export default Page;
