import './Prompts.css';
import TerminalUserInput from '../../components/TerminalUserInput/TerminalUserInput';
import { useEffect, useRef, useState } from 'react';
import Prompt from '../../components/Prompt/Prompt';
import { commands, createOldPrompt, cmdErr } from '../../utils/commands';

const Prompts = ({
    rootDirectory,
    currentDirectory,
    setCurrentDirectory,
    setIsFileSystemOpen,
    setIsVimOpen
  }) => {

  const [promptList, setPromptList] = useState([]);

  const terminalInputRef = useRef();
  //handle commands history

  const [commandsHistory, setCommandsHistory] = useState([]);
  const [handleCommandHistory, setHandleCommandHistory] = useState(0);



  const execCommand = async (cmd) => {

    let cmds = cmd.split(" ");
    let currentCommand = commands[cmds[0]];
    let haveParameter = cmds.length > 1 ? true : false;

    // handle error
    if (!currentCommand) {
      cmdErr(setPromptList, `Command not found use the help command`);
      return
    } else if (haveParameter !== currentCommand.params) {
      cmdErr(setPromptList, `Wrong parameter use help command to learn more`)
      return
    } else if (currentCommand.dir && !currentDirectory) {
      cmdErr(setPromptList, `You have to use the init command to use this command`)
      return
    };

    // handle specific command types
    if (cmds[0] === "init") {
      currentCommand.exec(setIsFileSystemOpen)
      return
    }

    if(cmds[0] === "vim") {
      currentCommand.exec(setIsVimOpen, cmds); 
      return;
    }

    //handle general commands 
    if (haveParameter && currentCommand.params && currentCommand.dir && currentDirectory) {
      await currentCommand.exec(
        setPromptList,
        {
          current: currentDirectory,
          setCurrent: setCurrentDirectory,
          root: rootDirectory
        },
        cmds
      )
    } else if (haveParameter && currentCommand.params && !currentCommand.dir) {
      await currentCommand.exec(
        setPromptList,
        cmds
      )
    } else if (!haveParameter && currentCommand.dir && currentDirectory) {
      await currentCommand.exec(
        setPromptList,
        {
          current: currentDirectory,
          setCurrent: setCurrentDirectory,
          root: rootDirectory
        },
      )
    } else {
      await currentCommand.exec(setPromptList);
    }

  }

  const handleOnKeyDown = async (e) => {

    if (e.key === 'Enter' && document.activeElement === terminalInputRef.current) {
      let command = e.target.value;
      e.preventDefault()
      createOldPrompt(command, setPromptList)

      // choose the best way to handle the commands
      await execCommand(command);

      
      // dont need to reset and add command to history if its empty
      if(e.target.value === "") return;

      //add command to commandshistory
      setCommandsHistory(prevCommandHistory => [
        ...prevCommandHistory,
        command
      ]);

      // transform current prompt value in an old prompt and clear current prompt
      // Reset current prompt
      e.target.value = ""

    }
    else if (e.key === 'ArrowUp' && document.activeElement === terminalInputRef.current) {
      e.preventDefault()
      if (commandsHistory.length === 0) return;
      if (e.target.value === "") {
        setHandleCommandHistory(commandsHistory.length - 1);
        e.target.value = commandsHistory[commandsHistory.length - 1];
      } else if (e.target.value !== "") {
        if(handleCommandHistory > 0) setHandleCommandHistory(handleCommandHistory - 1);
        e.target.value = commandsHistory[handleCommandHistory];
      }

    } else if (e.key === 'ArrowDown' && document.activeElement === terminalInputRef.current) {
      e.preventDefault()
      if (commandsHistory.length === 0) return;
      if (commandsHistory.length === handleCommandHistory) {
        e.target.value = ""
        return
      }
      if(handleCommandHistory < commandsHistory.length) setHandleCommandHistory(handleCommandHistory + 1);
      e.target.value = commandsHistory[handleCommandHistory];
    }
  };

  return (
    <>
      {promptList}
      <Prompt>
        <TerminalUserInput handleOnKeyDown={handleOnKeyDown} terminalInputRef={terminalInputRef} />
      </Prompt>
    </>
  )
}

export default Prompts;
