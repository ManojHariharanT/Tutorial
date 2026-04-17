import Badge from "../ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../ui/Card.jsx";
import { cn } from "../../utils/classNames.js";

const Console = ({
  title = "Console",
  description = "",
  output = "",
  error = "",
  status = "",
  className,
  footer = null,
}) => (
  <Card className={cn("overflow-hidden", className)}>
    <CardHeader className="border-b border-white/8 pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {status ? <Badge tone={error ? "hard" : "accent"}>{status}</Badge> : null}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="rounded-2xl border border-white/8 bg-surface-950/90 p-4 font-mono text-sm leading-6 text-slate-100">
        <pre className="overflow-x-auto whitespace-pre-wrap">{error || output || "No output yet."}</pre>
      </div>
      {footer}
    </CardContent>
  </Card>
);

export default Console;
