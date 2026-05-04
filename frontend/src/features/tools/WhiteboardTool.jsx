import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import Card, { CardContent } from "../../components/ui/Card.jsx";
import ToolShell from "./components/ToolShell.jsx";

const WhiteboardTool = () => (
  <ToolShell
    description="Sketch diagrams, flows, and low-fidelity UI ideas directly inside the developer toolbox."
    title="Whiteboard"
  >
    <Card>
      <CardContent className="pt-6">
        <div className="h-[72vh] min-h-[34rem] overflow-hidden rounded-2xl border border-slate-300 bg-white">
          <Excalidraw theme="light" />
        </div>
      </CardContent>
    </Card>
  </ToolShell>
);

export default WhiteboardTool;
