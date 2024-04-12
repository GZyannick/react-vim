import "./Prompts.css";
import TerminalUserInput from "../../components/TerminalUserInput/TerminalUserInput";
import { useEffect, useRef, useState } from "react";
import Prompt from "../../components/Prompt/Prompt";
import { execCommand, createOldPrompt } from "../../utils/commands";

const Prompts = ({
  rootDirectory,
  currentDirectory,
  setCurrentDirectory,
  setIsFileSystemOpen,
  setVimHandler,
}) => {
  const [promptList, setPromptList] = useState([]);
  const terminalInputRef = useRef();
  //handle commands history
  const [commandsHistory, setCommandsHistory] = useState([]);
  const [handleCommandHistory, setHandleCommandHistory] = useState(0);
  const handleOnKeyDown = async (e) => {
    if (
      e.key === "Enter" &&
      document.activeElement === terminalInputRef.current
    ) {
      let cmd = e.target.value;
      e.preventDefault();
      createOldPrompt(cmd, setPromptList);

      // choose the best way to handle the commands
      await execCommand({
        cmd,
        setPromptList,
        currentDirectory,
        setCurrentDirectory,
        rootDirectory,
        setVimHandler,
        setIsFileSystemOpen,
      });

      // dont need to reset and add command to history if its empty
      if (e.target.value === "") return;

      //add command to commandshistory
      setCommandsHistory((prevCommandHistory) => [...prevCommandHistory, cmd]);

      // transform current prompt value in an old prompt and clear current prompt
      // Reset current prompt
      e.target.value = "";
    } else if (
      e.key === "ArrowUp" &&
      document.activeElement === terminalInputRef.current
    ) {
      e.preventDefault();
      if (commandsHistory.length === 0) return;
      if (e.target.value === "") {
        setHandleCommandHistory(commandsHistory.length - 1);
        e.target.value = commandsHistory[commandsHistory.length - 1];
      } else if (e.target.value !== "") {
        if (handleCommandHistory > 0)
          setHandleCommandHistory(handleCommandHistory - 1);
        e.target.value = commandsHistory[handleCommandHistory];
      }
    } else if (
      e.key === "ArrowDown" &&
      document.activeElement === terminalInputRef.current
    ) {
      e.preventDefault();
      if (commandsHistory.length === 0) return;
      if (commandsHistory.length === handleCommandHistory) {
        e.target.value = "";
        return;
      }
      if (handleCommandHistory < commandsHistory.length)
        setHandleCommandHistory(handleCommandHistory + 1);
      e.target.value = commandsHistory[handleCommandHistory];
    }
  };

  return (
    <>
      {promptList}
      <Prompt directoryName={currentDirectory.name}>
        <TerminalUserInput
          handleOnKeyDown={handleOnKeyDown}
          terminalInputRef={terminalInputRef}
        />
      </Prompt>
    </>
  );
};

export default Prompts;
