import FolderStructur from "../../components/Explorer/FolderStructur";
import "./Vim.css";
import { useEffect, useState } from "react";
import CodeEditor from "../../components/Editor/CodeEditor";
import { getFileContent } from "../../utils/fsa.js";

const Vim = ({
  rootDirectory,
  currentDirectory,
  setCurrentDirectory,
  setIsFileSystemOpen,
  setIsVimOpen
}) => {
  const [isVimInit, setIsVimInit] = useState(false);
  const [fileId, setFileId] = useState()
  const [fileContent, setFileContent] = useState();
  const [currentFileOpen, setCurrentFileOpen] = useState();



  // TODO SUPPRIMER BUG QUI FAIT DE LA 2em ouverture le fichier est vide;
  // Peut etre revoir la façon de creer le content avec les useState dans Vim.jsx

  useEffect(() => {
    if (!fileId) return;

    const getContent = async () => {
      const [res, content] = await getFileContent(rootDirectory, fileId).catch(console.error)
      if (!res) return;
      setFileContent(content);
      setCurrentFileOpen(res);
    }
    getContent().catch(console.error);

  }, [fileId])

  if (isVimInit) {
    return (
      <CodeEditor setIsVimOpen={setIsVimOpen} fileContent={fileContent} currentFileOpen={currentFileOpen} setFileId={setFileId} />
    )
  } else {
    return (
      <>
        <div className="vim">
          <div className="vim__editor">
            <h4>Vim Like editor</h4>
            <p>===================================================</p>
            <div>
              <p>Keybinds</p>
              <ul>
                <li>Move: h, j, k, l</li>
                <li>Insert: i, a</li>
                <li>Insert NewLine: o</li>
                <li>Visual Mode: Esc</li>
                <li>save: :w </li>
                <li>leave Vim: :q </li>
              </ul>
            </div>
            <p>====================================================</p>
            <FolderStructur folderStruct={rootDirectory} setIsVimInit={setIsVimInit} setFileId={setFileId} />
          </div>
        </div>

      </>
    )
  }

}

export default Vim;




