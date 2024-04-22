import Prompt from "../components/Prompt/Prompt";
import TerminalUserDisplay from "../components/terminalUserDisplay/TerminalUserDisplay";
import { transformHandlerToFolderStructurObject, getUniqId } from "./fsa";
import { search } from "./fsa";

export const execCommand = async ({
  cmd,
  setPromptList,
  currentDirectory,
  setCurrentDirectory,
  rootDirectory,
  setVimHandler,
  setIsFileSystemOpen,
}) => {
  let cmds = splitStringAndClearEmptyString(cmd.trim(), " ");
  let currentCommand = commands[cmds[0]];
  let haveParameter = cmds.length > 1 ? true : false;

  // handle current error
  if (!currentCommand) {
    cmdErr(setPromptList, `Command not found use the help command`);
    return;
  } else if (haveParameter !== currentCommand.params && cmds[0] !== "ls") {
    cmdErr(setPromptList, `Wrong parameter use help command to learn more`);
    return;
  } else if (currentCommand.dir && !currentDirectory) {
    cmdErr(
      setPromptList,
      `You have to use the init command before to use this command`,
    );
    return;
  }

  // handle specific command types
  if (cmds[0] === "init") {
    currentCommand.exec(setIsFileSystemOpen);
    return;
  }

  if (cmds[0] === "vim") {
    currentCommand.exec(
      setVimHandler,
      setPromptList,
      {
        current: currentDirectory,
        setCurrent: setCurrentDirectory,
        root: rootDirectory,
      },
      cmds,
    );
    return;
  }

  if (cmds[0] === "ls") {
    currentCommand.exec(
      setPromptList,
      {
        current: currentDirectory,
        setCurrent: setCurrentDirectory,
        root: rootDirectory,
      },
      cmds,
    );
    return;
  }

  //handle general commands
  if (
    haveParameter &&
    currentCommand.params &&
    currentCommand.dir &&
    currentDirectory
  ) {
    await currentCommand.exec(
      setPromptList,
      {
        current: currentDirectory,
        setCurrent: setCurrentDirectory,
        root: rootDirectory,
      },
      cmds,
    );
  } else if (haveParameter && currentCommand.params && !currentCommand.dir) {
    await currentCommand.exec(setPromptList, cmds);
  } else if (!haveParameter && currentCommand.dir && currentDirectory) {
    await currentCommand.exec(setPromptList, {
      current: currentDirectory,
      setCurrent: setCurrentDirectory,
      root: rootDirectory,
    });
  } else {
    await currentCommand.exec(setPromptList);
  }
};

// used to clear all the terminal
const clear = (setPromptList) => setPromptList([]);

// give access to the user local file
const init = (setIsFileSystemOpen) => setIsFileSystemOpen(true);

// Show all available commands the user can use
const help = (setState) => {
  const getCommands = () => {
    let content = [];
    let i = 0;
    for (let idx in commands) {
      content.push(
        <li key={`command-${i}`}>
          {" "}
          <b>{idx}</b> : {commands[idx].desc}
        </li>,
      );
      i++;
    }
    return content;
  };

  setState((prevState) => [
    ...prevState,
    <ul key={prevState.length} className="command__result">
      {getCommands()}
    </ul>,
  ]);
};

const cd = (setState, directory, cmds) => {
  const splitParameter = splitStringAndClearEmptyString(cmds.pop(), "/");
  if (!splitParameter) return cmdErr(setState, "couldnt find paramater");
  const fileOrDirectory = pathHandlerV2(setState, directory, splitParameter);
  if (!fileOrDirectory || !fileOrDirectory.isFolder)
    return cmdErr(setState, "path not found");
  directory.setCurrent((prevCurrent) => (prevCurrent = fileOrDirectory));
};

const mkdir = async (setState, directory, cmds) => {
  const splitParameter = splitStringAndClearEmptyString(cmds.pop(), "/");
  if (!splitParameter) return cmdErr(setState, "couldnt find parameter");
  const folderToCreate = splitParameter.pop();
  const fileOrDirectory = pathHandlerV2(setState, directory, splitParameter);
  if (!fileOrDirectory) return cmdErr(setState, "file or directory not found");

  const newDirectoryHandle = await createNewHandle(
    folderToCreate,
    fileOrDirectory,
    "directory",
  );
  if (newDirectoryHandle) {
    fileOrDirectory.items.push(newDirectoryHandle);

    setState((prevState) => [
      ...prevState,
      <div key={prevState.length} className="command__result inline__command">
        <p> Folder {folderToCreate} created with success </p>
      </div>,
    ]);
  }
};

const touch = async (setState, directory, cmds) => {
  const splitParameter = splitStringAndClearEmptyString(cmds.pop(), "/");
  if (!splitParameter) return cmdErr(setState, "couldnt find parameter");
  const fileToCreate = splitParameter.pop();

  let fileOrDirectory = pathHandlerV2(setState, directory, splitParameter);
  if (!fileOrDirectory) return cmdErr(setState, "file or directory not found");
  const newFileHandle = await createNewHandle(
    fileToCreate,
    fileOrDirectory,
    "file",
  );
  if (newFileHandle) {
    fileOrDirectory.items.push(newFileHandle);
    setState((prevState) => [
      ...prevState,
      <div key={prevState.length} className="command__result inline__command">
        <p> file {fileToCreate} created with success </p>
      </div>,
    ]);
  }
};

const vim = (setVimHandler, setState, directory, cmds) => {
  const splitParameter = splitStringAndClearEmptyString(cmds.pop(), "/");
  if (!splitParameter) return;
  const fileOrDirectory = pathHandlerV2(setState, directory, splitParameter);
  if (!fileOrDirectory) return;
  setVimHandler({
    isOpen: true,
    fileOrDirectory: fileOrDirectory,
    isFolder: fileOrDirectory.isFolder,
  });
};

// show the content of the current Directory
const ls = (setState, directory, cmds) => {
  let fileOrDirectory = directory.current;

  if (cmds.length > 1) {
    const splitParameter = splitStringAndClearEmptyString(cmds.pop(), "/");
    if (!splitParameter) return cmdErr(setState, "path not found");
    fileOrDirectory = pathHandlerV2(setState, directory, splitParameter);
    if (!fileOrDirectory) return;
  }

  setState((prevState) => [
    ...prevState,
    <div key={prevState.length} className="command__result inline__command">
      {fileOrDirectory.items.map((item) => {
        if (item.name === ".DS_Store") return;
        return <p key={item.id}>{item.name}</p>;
      })}
    </div>,
  ]);
};



// const rm = async (setState, dirHandle, cmds) => {
// }

// ----- private commands ----- //

// transform user prompt on enter to a div with e.target.value
export const createOldPrompt = (value, SetState, directoryName) => {
  if (value === "clear") return;
  SetState((prevState) => [
    ...prevState,
    <Prompt key={prevState.length} directoryName={directoryName}>
      <TerminalUserDisplay content={value} />
    </Prompt>,
  ]);
};

// if commands doenst exist return command not found
export const cmdErr = (setState, errMessage) => {
  setState((prevState) => [
    ...prevState,
    <p className="command__result">{errMessage}</p>,
  ]);
};

/*
 *  createNewHandle : create a new directory or file
 *  path: string (the name of file or directory)
 *  handle : directoryHandle (where file or dir is created)
 *  type: string (type of file to create)
 *
 *  return newHandle (fileHandle or DirectoryHandle)
 */

const createNewHandle = async (path, currentDir, type) => {
  if (!path || path.includes("/")) return;
  let newHandle;
  let uniqId = getUniqId();

  if (type === "file") {
    newHandle = await currentDir.handler
      .getFileHandle(path, { create: true })
      .catch((err) => console.error(err));
  } else if (type === "directory") {
    newHandle = await currentDir.handler
      .getDirectoryHandle(path, { create: true })
      .catch((err) => console.log(err));
  }

  if (!newHandle) return;
  return transformHandlerToFolderStructurObject(
    newHandle,
    uniqId,
    currentDir.id,
  );
};

/*
 *  getParentDir
 *
 *  dir : directory handle ( where search start)
 *  searchValue: string (value to find)
 *
 *  return undefined / parent DirectoryHandle of searchValue
 *
 *
 */

const pathHandlerV2 = (setState, directory, paths) => {
  let fileOrDirectory = directory.current;
  for (const path of paths) {
    if (path === ".") continue;
    if (path === "~") {
      fileOrDirectory = directory.root;
    } else if (path === "..") {
      if (fileOrDirectory.id === directory.root.id)
        return cmdErr(setState, `Cannot run this command ${path}`);
      const getParentDirectory = search(
        directory.root,
        fileOrDirectory.id,
        true,
      );
      if (!getParentDirectory) return;
      fileOrDirectory = getParentDirectory;
    } else {
      const subDirectory = fileOrDirectory.items.find(
        (dir) => dir.name === path,
      );
      if (!subDirectory) return;
      fileOrDirectory = subDirectory;
    }
  }
  return fileOrDirectory;
};

// const splitParams = (params) => {
//   const parameter = params.pop();
//   return parameter
//     ? parameter.split("/").filter((param) => param != "")
//     : undefined;
// };

const splitStringAndClearEmptyString = (val, charToSplit) => {
  return val.split(charToSplit).filter((param) => param != "");
};

// List of all commands the user can use
export const commands = {
  clear: {
    exec: clear,
    desc: "clear the terminal",
    dir: false,
    params: false,
  },
  help: {
    exec: help,
    desc: "give the description of all available commands",
    dir: false,
    params: false,
  },
  ls: {
    exec: ls,
    desc: "show all file and folder",
    dir: true,
    params: true,
  },
  mkdir: {
    exec: mkdir,
    desc: "create a new folder",
    dir: true,
    params: true,
  },
  touch: {
    exec: touch,
    desc: "create a new file",
    dir: true,
    params: true,
  },
  cd: {
    exec: cd,
    desc: "allow you to change directory",
    dir: true,
    params: true,
  },
  init: {
    exec: init,
    desc: "allow the terminal to grant access of local storage",
    dir: false,
    params: false,
  },
  vim: {
    exec: vim,
    desc: "a vim like editor",
    dir: true,
    params: true,
  },
};
