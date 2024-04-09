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




  useEffect(() => {
    if (!fileId) return;

    const getContent = async () => {
      const [handler, content] = await getFileContent(rootDirectory, fileId).catch(console.error)
      if (!handler) return;
      setFileContent(content);
      setCurrentFileOpen(handler);
    }
    getContent().catch(console.error);

  }, [fileId])

  if (isVimInit && fileContent !== undefined) {
    return (
        <CodeEditor setIsVimOpen={setIsVimOpen} fileContent={fileContent} setFileContent={setFileContent} currentFileOpen={currentFileOpen} setFileId={setFileId} />
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




