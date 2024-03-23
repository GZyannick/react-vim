import { Editor } from "@monaco-editor/react";
import { initVimMode, VimMode } from "monaco-vim";
import * as monaco from "monaco-editor"
import { useRef } from "react";
import './editor.css'
const CodeEditor = ({ setIsVimOpen, fileContent, currentFileOpen, setFileId }) => {

  const editorRef = useRef();
  const options = {
    readOnly: false,
    minimap: { enabled: false },
    wordWrap: "on",
    cursorStyle: "block",
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    matchBrackets: "always",
  }

  //TODO trouver comment le mettre dans editorCommands avec setIsVimInit
  VimMode.Vim.defineEx('quit', 'q', () => {
    setFileId(prevFileId => prevFileId = undefined);
    setIsVimOpen(false)
  })

  VimMode.Vim.defineEx('write', 'w', async () => {
    if (!currentFileOpen) return; // TODO voir si doit creer nouveaux file pas sure si je le creer apres ou avant decrir dedans


  })

  useRef(() => {

  }, [])


  const onMount = (editor) => {
    editorRef.current = editor;
    const statusMode = document.getElementById("statusBar");
    initVimMode(editorRef.current, statusMode);
    editor.focus();
  }

  // const handleEditorChange = (value, event) => {
  //   console.log(value, event);
  // }

  return (
    <>
      <Editor
        id="monaco__editor"
        height="80vh"
        theme="vs-dark"
        onMount={onMount}
        defaultLanguage="javascript"
        defaultValue={fileContent}
        options={options}
      //onChange={handleEditorChange}
      />
      <div id="statusBar"></div>
    </>
  )
}

export default CodeEditor;


