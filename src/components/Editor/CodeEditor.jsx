import { Editor } from "@monaco-editor/react";
import { initVimMode, VimMode } from "monaco-vim";
import * as monaco from "monaco-editor"
import { useRef, useState } from "react";
import './editor.css'


const monacoLanguageSupport = {
  ".js": "javascript",
  ".ts": "typescript",
  ".json": "json",
  ".css": "css",
  ".html": "html",
}


const CodeEditor = ({ setIsVimOpen, fileContent, setFileContent, currentFileOpen, setFileId }) => {

  const [language, setLanguage] = useState('javascript')

  const [error, setError] = useState("");
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
    if(fileContent === editorRef.current.getValue()){
      setFileId(prevFileId => prevFileId = undefined);
      setError("");
      setIsVimOpen(false);
    }else {
      setError("no write since last change use ! to override it !");    
    }
  })

  VimMode.Vim.defineEx('write', 'w', async () => {
    if (!currentFileOpen) return;
    const content = editorRef.current.getValue();
    if(content === undefined) return;
    const writable = await currentFileOpen.createWritable()
    setFileContent(prevContent => prevContent = content)
    await writable.write(content);
    await writable.close();
  })

  const onMount = (editor) => {

    editorRef.current = editor;
    const statusMode = document.getElementById("statusBar");
    initVimMode(editorRef.current, statusMode);

    // get extension
    const regex =/\.[0-9a-z]+$/i;
    const currentLanguage = currentFileOpen.name.match(regex)[0]
    if(monacoLanguageSupport[currentLanguage]){
      //editor.setLanguage(monacoLanguageSupport[currentLanguage]);
      monaco.editor.setModelLanguage(editor.getModel(), monacoLanguageSupport[currentLanguage])
    }
    editor.focus();
  }

  return (
    <>
      <Editor
        id="monaco__editor"
        height="100vh"
        theme="vs-dark"
        onMount={onMount}
        options={options}
        defaultValue={fileContent}
        defaultLanguage={language}
      />
      <div className="editorStatus">
        <div id="statusBar"></div>
        <div id="errorHandler">{error}</div>
      </div> 
    </>
  )
}

export default CodeEditor;


