import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";

const FileExplorer = ({ files, activeFileId, onAddFile, onRemoveFile, onSelectFile }) => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-center justify-between gap-3">
        <CardTitle>Files</CardTitle>
        <Button onClick={onAddFile} size="sm" variant="secondary">
          New file
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-2 pt-4">
      {files.map((file) => (
        <div
          key={file.id}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 ${
            file.id === activeFileId
              ? "border-accent-400/25 bg-accent-400/10"
              : "border-white/8 bg-white/4 hover:border-white/12 hover:bg-white/6"
          }`}
        >
          <button className="min-w-0 flex-1 text-left" onClick={() => onSelectFile(file.id)} type="button">
            <p className="truncate text-sm font-semibold text-white">{file.name}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{file.path}</p>
          </button>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">{file.language}</Badge>
            {files.length > 1 ? (
              <button
                className="rounded-xl border border-white/10 px-2 py-1 text-xs text-slate-400 hover:bg-white/6"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveFile(file.id);
                }}
                type="button"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default FileExplorer;
