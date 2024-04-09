//TODO trouver comment le mettre dans editorCommands avec setIsVimInit

const handleWritable = async (fileOpen, content) => {
  const writable = await fileOpen.createWritable();
  await writable.write(content);
  await writable.close();
};

export const writeMode = async (fileOpen, editorRef, setContent) => {
  if (!fileOpen) return;
  const content = editorRef.current.getValue();
  if (content === undefined) return;

  handleWritable(fileOpen, content); // register in local file;
  setContent((prevContent) => (prevContent = content)); // set value in react front useState;
};

export const quitMode = (content, editorRef, setId, setErr, setIsOpen) => {
  if (content === editorRef.current.getValue()) {
    setId((prevId) => (prevId = undefined));
    setErr("");
    setIsOpen(false);
  } else {
    setErr("now write since last change use ! to override it");
  }
};
