
import Prompt from "../components/Prompt/Prompt";
import TerminalUserDisplay from "../components/terminalUserDisplay/TerminalUserDisplay";


// TODO ne pas compter les espace en tant que params si il y a pas dautres char 

// ---------------- Work -------------- //
//  Clear
//  help
//  mkdir
//  touch
//  init
//  cd

// ----------------- TODO --------------- //
// vim 
// add tmux control to create remove new panel


// clear the terminal
const clear = (setState) => {
  setState([]);
}

// show all available commands
const help = (setState) => {
  const getCommands = () => {
    let content = [];
    let i = 0;
    for (let idx in commands) {
      content.push(<li key={`command-${i}`}> <b>{idx}</b> : {commands[idx].desc}</li>)
      i++
    }
    return content
  }

  setState(prevState => [
    ...prevState,
    <ul key={prevState.length} className="command__result">
      {getCommands()}
    </ul>
  ])
}

// give access to the user local file
const init = (setState) => {
  setState(true);
}

const vim = (setIsVimOpen, path) => {
  setIsVimOpen(true);
}


const ls = async (setState, dirHandle) => {
  const directoryTree = [];

  for await (const entry of dirHandle.current.values()) {
    if (entry.name !== ".DS_Store") {
      directoryTree.push(
        <p key={entry.name}>{entry.name}</p>
      );
    };
  };

  await setState(prevState => [
    ...prevState,
    <div key={prevState.length} className="command__result inline__command">
      {directoryTree}
    </div>
  ])

}

const cd = async (setState, dirHandle, cmds) => {
  const pathParameter = cmds.pop();
  if (!pathParameter) return; // todo return cmderr

  const directories = pathParameter.split("/")
  await pathHandler(setState, dirHandle, directories)
  dirHandle.setCurrent(prevCurrent => prevCurrent = dirHandle.current);
}

const mkdir = async (setState, dirHandle, cmds) => {
  const pathParameter = cmds.pop();
  const newDirectoryHandle = await createNewHandle(pathParameter, dirHandle.current, "directory")

  if (newDirectoryHandle) {
    setState(prevState =>
      [
        ...prevState,
        <div key={prevState.length} className="command__result inline__command">
          <p> Folder {pathParameter} created with success </p>
        </div>
      ]
    )
  }
}


const touch = async (setState, dirHandle, cmds) => {
  const pathParameter = cmds.pop();
  const newFileHandle = await createNewHandle(pathParameter, dirHandle.current, "file");

  if (newFileHandle) {
    setState(prevState =>
      [
        ...prevState,
        <div key={prevState.length} className="command__result inline__command">
          <p> file {pathParameter} created with success </p>
        </div>
      ]
    )
  }

}



// const rm = async (setState, dirHandle, cmds) => {
// }


// List of all commands the user can use
export const commands = {
  'clear': {
    'exec': clear,
    'desc': "clear the terminal",
    'dir': false,
    'params': false,
  },
  'help': {
    'exec': help,
    'desc': "give the description of all available commands",
    'dir': false,
    'params': false,
  },
  'ls': {
    'exec': ls,
    'desc': "show all file and folder",
    'dir': true,
    'params': false,
  },
  'mkdir': {
    'exec': mkdir,
    'desc': "create a new folder",
    'dir': true,
    'params': true,
  },
  'touch': {
    'exec': touch,
    'desc': "create a new file",
    'dir': true,
    'params': true,
  },
  'cd': {
    'exec': cd,
    'desc': "allow you to change directory",
    'dir': true,
    'params': true,
  },
  'init': {
    'exec': init,
    'desc': "allow the terminal to grant access of local storage",
    'dir': false,
    'params': false,
  },
  'vim': {
    'exec': vim,
    'desc': "a vim like editor",
    'dir': true,
    'params': true,
  } 
};


// ----- private commands ----- //


// transform user prompt on enter to a div with e.target.value
export const createOldPrompt = (value, SetState) => {
  if (value === "clear") return;
  SetState(prevState => [...prevState, <Prompt key={prevState.length}><TerminalUserDisplay content={value} /></Prompt>])
}

// if commands doenst exist return command not found
export const cmdErr = (setState, errMessage) => {
  setState(prevState => [...prevState, <p className="command__result">{errMessage}</p>]);
}



/*
 *  createNewHandle : create a new directory or file
 *  path: string (the name of file or directory)
 *  handle : directoryHandle (where file or dir is created)
 *  type: string (type of file to create)
 *
 *  return newHandle (fileHandle or DirectoryHandle)
 */


const createNewHandle = async (path, handle, type) => {
  if (!path || path.includes("/")) return;
  let newHandle;

  if (type === "file") {
    newHandle = await handle.getFileHandle(
      path,
      { create: true }
    ).catch(err => console.error(err))
  } else if (type === "directory") {
    newHandle = await handle.getDirectoryHandle(
      path,
      { create: true }
    ).catch(err => console.log(err))
  }

  return newHandle;
}

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

const getParentOfDir = async (dir, searchValue) => {
  let res;
  for await (const entry of dir.values()) {
    if (res) return res;
    if (entry.kind !== "directory") continue;
    if (entry.name === searchValue) {
      res = dir
    } else {
      res = await getParentOfDir(entry, searchValue)
    }
  };
  return res;
}


// idea 
// Handle file too
// return object with kind, name, and data to know if its a file or an dir
// remove cmdErr in pathHandle (not sure about it)
const pathHandler = async (setState, dirHandle, paths) => {
  let chooseDirectory;

  for await (const path of paths) {
    if (path === ".") continue;
    if (path === "~") {
      dirHandle.current = dirHandle.root
    } else if (path === "..") {
      if (dirHandle.root === dirHandle.current) {
        return cmdErr(setState, `Cannot run .. ${path}`);
      };

      const getParentDir = await getParentOfDir(dirHandle.root, dirHandle.current.name);
      if (!getParentOfDir) return cmdErr(setState, `Couldnt find ${path}`)
      dirHandle.current = getParentDir;
    } else {
      const subDir = await dirHandle.current.getDirectoryHandle(path).catch(console.error)
      if (!subDir) return cmdErr(setState, `Couldnt find ${path}`);
      dirHandle.current = subDir;
    }
  }  

  return chooseDirectory; 
}

