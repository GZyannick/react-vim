const monacoLanguageSupport = {
  ".js": "javascript",
  ".ts": "typescript",
  ".json": "json",
  ".css": "css",
  ".html": "html",
};

export const getLanguageExtension = (currentFileOpen, monaco, editor) => {
  const regex = /\.[0-9a-z]+$/i;
  const currentLanguage = currentFileOpen.name.match(regex)[0];
  if (monacoLanguageSupport[currentLanguage]) {
    //editor.setLanguage(monacoLanguageSupport[currentLanguage]);
    monaco.editor.setModelLanguage(
      editor.getModel(),
      monacoLanguageSupport[currentLanguage],
    );
  }
};
