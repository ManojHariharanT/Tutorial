import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader.jsx";
import Button from "../../../components/ui/Button.jsx";

const ToolShell = ({ title, description, eyebrow = "Developer Toolbox", children, actions }) => (
  <div className="min-h-screen" style={{
    background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%), linear-gradient(180deg, #f7faff 0%, #f3f6fb 100%)',
    color: '#1f2937'
  }}>
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button as={Link} to="/tools" variant="secondary">
          Back to tools
        </Button>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      <PageHeader description={description} eyebrow={eyebrow} light title={title} />
      {children}
    </main>
  </div>
);

export default ToolShell;
