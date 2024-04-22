import FolderStructur from "../../components/Explorer/FolderStructur";
import "./Vim.css";
import { useEffect, useState } from "react";
import CodeEditor from "../../components/Editor/CodeEditor";
import { getFileContent } from "../../utils/fsa.js";

const Vim = ({ vimHandler, setVimHandler, setIsFileSystemOpen }) => {
  const [isVimInit, setIsVimInit] = useState(false);
  const [fileId, setFileId] = useState();
  const [fileContent, setFileContent] = useState();
  const [currentFileOpen, setCurrentFileOpen] = useState();

  useEffect(() => {
    if (
      vimHandler.isFolder === false &&
      vimHandler.fileOrDirectory &&
      !fileId
    ) {
      setFileId(vimHandler.fileOrDirectory.id);
      setIsVimInit(true);
    } else if (vimHandler.isFolder && !fileId) return;
    const getContent = async () => {
      // TODO Meilleur Gestion de fileOrDirectory
      const [handler, content] = await getFileContent(
        vimHandler.fileOrDirectory,
        fileId,
      ).catch(console.error);
      if (!handler) return;
      setFileContent(content);
      setCurrentFileOpen(handler);
    };
    getContent().catch(console.error);
  }, [fileId, vimHandler]);
  
   


  return (
    <div className="explorer__editor">
      {
        // remove != isVimInit to have folder and codeEditor at the same time
        (vimHandler.isFolder && !isVimInit) && <FolderStructur
           vimHandler={vimHandler}
          setVimHandler={setVimHandler}
          setIsVimInit={setIsVimInit}
          setFileId={setFileId}
        />
      }

      {
        (isVimInit && fileContent !== undefined) &&  <CodeEditor
          setVimHandler={setVimHandler}
          fileContent={fileContent}
          setFileContent={setFileContent}
          currentFileOpen={currentFileOpen}
          setFileId={setFileId}
        />

      }
    </div>
  )
 };

export default Vim;



 // if (isVimInit && fileContent !== undefined) {
 //    return (
 //      <div>
 //        <CodeEditor
 //          setVimHandler={setVimHandler}
 //          fileContent={fileContent}
 //          setFileContent={setFileContent}
 //          currentFileOpen={currentFileOpen}
 //          setFileId={setFileId}
 //        />
 //
 //      </div>
 //         );
 //  } else if (vimHandler.isFolder) {
 //    return (
 //      <>
 //        <div className="vim">
 //          <div className="vim__editor">
 //            <h4>Vim Like editor</h4>
 //            <p>===================================================</p>
 //            <div>
 //              <p>Keybinds</p>
 //              <ul>
 //                <li>Move: h, j, k, l</li>
 //                <li>Insert: i, a</li>
 //                <li>Insert NewLine: o</li>
 //                <li>Visual Mode: Esc</li>
 //                <li>save: :w </li>
 //                <li>leave Vim: :q </li>
 //              </ul>
 //            </div>
 //            <p>====================================================</p>
 //            <FolderStructur
 //              vimHandler={vimHandler}
 //              setVimHandler={setVimHandler}
 //              setIsVimInit={setIsVimInit}
 //              setFileId={setFileId}
 //            />
 //          </div>
 //        </div>
 //      </>
 //    );
 //  }
 //

// return (
//      <div className="folder__codeEditor">
//        if(vimHandler.isFolder){
//        <FolderStructur
//          vimHandler={vimHandler}
//          setVimHandler={setVimHandler}
//          setIsVimInit={setIsVimInit}
//          setFileId={setFileId}
//        />
//      }
//        if(ivVimInit && fileContent !== undefined) {
//          <CodeEditor
//            setVimHandler={setVimHandler}
//            fileContent={fileContent}
//            setFileContent={setFileContent}
//           currentFileOpen={currentFileOpen}
//           setFileId={setFileId}
//          />
//      }
//                
//      </div>
//         );
//};



