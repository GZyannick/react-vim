// store isPrev in keybind to know if we go up or down in the explorer
const movementKeybinds = {
  "j": false,
  "ArrowDown": false,
  "k": true,
  "ArrowUp": true,
}

const openKeybinds = {
  "Enter": "",
  "h": "",
  "l": ""
}

const returnNewSelected = (children, isPrev) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i].id === "selected") {
      const currentChild = isPrev ? children[i - 1] : children[i + 1];
      if (!currentChild) return;
      currentChild.id = "selected";
      children[i].id = "";
      break
    }
  }
}


export const handleExplorerKeys = (e, spans, setIsVimInit) => {

  if (e.key in movementKeybinds) {
    e.preventDefault();
    returnNewSelected(spans, movementKeybinds[e.key]);
  }

  if (e.key in openKeybinds) {
    e.preventDefault();

    const selectedElement = document.querySelector("#selected");
    const isFolder = selectedElement.dataset.isfolder;

    if (isFolder === "true") {
      selectedElement.click();
    } else if (isFolder === "false") {
      setIsVimInit(true);
    }
  }
}
