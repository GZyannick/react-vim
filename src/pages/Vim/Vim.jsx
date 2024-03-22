import FolderStructur from "../../components/Explorer/FolderStructur";
import "./Vim.css";
import { useEffect, useState } from "react";
import CodeEditor from "../../components/Editor/CodeEditor";

const Vim = ({
  rootDirectory,
  currentDirectory,
  setCurrentDirectory,
  setIsFileSystemOpen,
  setIsVimOpen
}) => {
  const [isVimInit, setIsVimInit] = useState(false);

  if (isVimInit) {
    return (
        <CodeEditor setIsVimOpen={setIsVimOpen}/>
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

            <FolderStructur folderStruct={rootDirectory} setIsVimInit={setIsVimInit}/>
          </div>
        </div>

      </>
    )
  }

}

export default Vim;




