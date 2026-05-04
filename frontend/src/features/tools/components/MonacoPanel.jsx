import Editor from "@monaco-editor/react";
import { cn } from "../../../utils/classNames.js";

const MonacoPanel = ({ className, height = "28rem", language = "javascript", options, ...props }) => (
  <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-surface-950", className)}>
    <Editor
      height={height}
      language={language}
      theme="vs"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        ...options,
      }}
      {...props}
    />
  </div>
);

export default MonacoPanel;
