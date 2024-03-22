export const getFile = async (isFileSystemOpen, setIsFileSystemOpen) => {
  if (!isFileSystemOpen) return;
  try {
    const [fileHandle] = await window.showOpenFilePicker();
    console.log(fileHandle)
  } catch (err) {
    console.log(err)
  }
  setIsFileSystemOpen(false);
}

export const openDirectory = async (mode = "read") => {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    "showDirectoryPicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    let directoryStructure = undefined;

    // Recursive function that walks the directory structure.
    const getFiles = async (dirHandle, path = dirHandle.name) => {
      const dirs = [];
      const files = [];
      for await (const entry of dirHandle.values()) {
        const nestedPath = `${path}/${entry.name}`;
        if (entry.kind === "file") {
          files.push(
            entry.getFile().then((file) => {
              file.directoryHandle = dirHandle;
              file.handle = entry;
              return Object.defineProperty(file, "webkitRelativePath", {
                configurable: true,
                enumerable: true,
                get: () => nestedPath,
              });
            })
          );

        } else if (entry.kind === "directory") {
          dirs.push(getFiles(entry, nestedPath));
        }
      }


      return [
        ...(await Promise.all(dirs)).flat(),
        ...(await Promise.all(files)),
      ];

    };

    try {
      // Open the directory.
      const handle = await window.showDirectoryPicker({
        mode,
      });
      // Get the directory structure.
      directoryStructure = await getFiles(handle, undefined);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err.name, err.message);
      }
    }
    return directoryStructure;
  }

};


export const createNewDir = (entry, folder) => {

}





// creer un tree avec folder est file
// + si root nexiste pas alors ajouter un dir
// + creer une nouvelle banche pour chaque enfant
// + si la branch est un file alors elle ne pourra pas avoir d'enfant
// + si la branch est un folder alors elle pourra avoir des enfant
// + reiterer jusqua l'abre creer 
//
//

export const openDirectoryInstance = async (mode = "read") => {
  let dirHandle;
  const supportsFileSystemAccess =
    "showDirectoryPicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();

  if (!supportsFileSystemAccess) {
    console.error("File system api is not supported by your browser")
    return
  };

  try {
    dirHandle = await window.showDirectoryPicker({
      mode
    })
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error(err.name, err.message);
    }
  }
  return dirHandle
}



export const getUniqId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const transformHandlerToFolderStructurObject = (directory, uniqId, id) => {
  const folderStructur = {
    id: uniqId,
    name: directory.name,
    handler: directory,
    isFolder: directory.kind === "directory" ? true : false,
    parentId: id,
    items: [],
  };

  return folderStructur;
}

// create an object of all directories and files from le local storage
export const initFolderData = async (directory, id = "root") => {
  const uniqId = getUniqId();
  const folderStructur = transformHandlerToFolderStructurObject(directory, uniqId, id)

  if (!folderStructur.isFolder) return folderStructur;

  for await (const item of directory.values()) {
    folderStructur.items.push(await initFolderData(item, uniqId))
  }
  return folderStructur
}


