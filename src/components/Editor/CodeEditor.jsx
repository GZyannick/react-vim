import { Editor } from "@monaco-editor/react";
import { initVimMode, VimMode } from "monaco-vim";
import * as monaco from "monaco-editor";
import { useRef, useState } from "react";
import "./editor.css";

// utils
import { getLanguageExtension } from "../../utils/editorUtils/editorLanguageSupport";
import { editorOptions } from "../../utils/editorUtils/editorOptions";
import { writeMode, quitMode } from "../../utils/editorUtils/editorCommands";
const CodeEditor = ({
  setVimHandler,
  fileContent,
  setFileContent,
  currentFileOpen,
  setFileId,
}) => {
  const [language, setLanguage] = useState(
    getLanguageExtension(currentFileOpen),
  );

  const [error, setError] = useState("");
  const editorRef = useRef();
  VimMode.Vim.defineEx("write", "w", async () =>
    writeMode(currentFileOpen, editorRef, setFileContent),
  );
  VimMode.Vim.defineEx("quit", "q", () =>
    quitMode(fileContent, editorRef, setFileId, setError, setVimHandler),
  );

  const onMount = (editor) => {
    editorRef.current = editor;
    const statusMode = document.getElementById("statusBar");
    initVimMode(editorRef.current, statusMode);
    editor.focus();
  };

  return (
    <>
      <Editor
        id="monaco__editor"
        height="100vh"
        theme="vs-dark"
        onMount={onMount}
        options={editorOptions}
        defaultValue={fileContent}
        defaultLanguage={language}
      />
      <div className="editorStatus">
        <div id="statusBar"></div>
        <div id="errorHandler">{error}</div>
      </div>
    </>
  );
};

export default CodeEditor;
