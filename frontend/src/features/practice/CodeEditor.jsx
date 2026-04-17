const CodeEditor = ({ code, onChange }) => (
  <textarea
    className="editor-surface"
    onChange={(event) => onChange(event.target.value)}
    spellCheck={false}
    value={code}
  />
);

export default CodeEditor;
