import "./Vim.css";
import { useEffect, useState } from "react";

const Vim = ({
  rootDirectory,
  currentDirectory,
  setCurrentDirectory,
  setIsFileSystemOpen,
  setIsVimOpen
}) => {
  const [isVimInit, setIsVimInit] = useState(false);
  const [isVisualMode, setIsVisualMode] = useState(true);
  const [dirAndFiles, setDirAndFiles] = useState([])

  useEffect(() => {
    (async () => {
      const currentDirAndFile = [];
      if (!isVimInit) {
        for await (const data of currentDirectory.values()) {
          if (data.name !== ".DS_Store") currentDirAndFile.push(data);
        }
        setDirAndFiles([...currentDirAndFile])
      }
    })()
  }, [])

  if (isVimInit) {
    return (
      <>

      </>
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

            <p>./</p>
            <p>..</p>

          </div>
          <footer>
            {isVisualMode ? "VISUAL MODE" : "INSERT MODE"}
          </footer>
        </div>

      </>
    )
  }
}

export default Vim;
