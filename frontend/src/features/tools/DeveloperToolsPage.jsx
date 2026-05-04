import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { developerTools } from "./toolboxData.js";

const DeveloperToolsPage = () => (
  <div className="page-shell">
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        description="Choose a focused workspace for formatting, testing, comparing, sketching, generating QR codes, or drafting a resume."
        eyebrow="Developer Toolbox"
        title="Practical tools for everyday build work"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {developerTools.map((tool) => (
          <Link className="group block" key={tool.id} to={tool.path}>
            <Card className="h-full overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-accent-400/35">
              <div className={`h-1.5 bg-gradient-to-r ${tool.accent}`} />
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge tone="accent">{tool.category}</Badge>
                  <span className="text-sm font-semibold text-accent-200 transition group-hover:text-accent-100">
                    Open
                  </span>
                </div>
                <CardTitle className="mt-3">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm leading-7 text-slate-400">{tool.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  </div>
);

export default DeveloperToolsPage;
