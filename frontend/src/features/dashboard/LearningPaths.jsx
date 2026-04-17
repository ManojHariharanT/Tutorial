import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";

const LearningPaths = ({ paths }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-2xl font-semibold text-white">Learning paths</h2>
      <p className="mt-1 text-sm text-slate-400">
        Keep tutorials and practice in the same path so progress feels cumulative.
      </p>
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      {paths.map((path) => (
        <Card
          key={path.id}
          className={`overflow-hidden bg-gradient-to-br ${path.color} transition duration-200 hover:-translate-y-1`}
        >
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone="neutral">{path.level}</Badge>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {path.duration}
              </span>
            </div>
            <CardTitle className="mt-3">{path.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <p className="text-sm leading-7 text-slate-300">{path.description}</p>

            <div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">Completion</span>
                <span className="font-semibold text-white">
                  {path.completedItems}/{path.totalItems}
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-400"
                  style={{ width: `${path.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
              <span>{path.completedTutorials} tutorials complete</span>
              <span>{path.solvedProblems} problems solved</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button as={Link} size="sm" to="/tutorials" variant="secondary">
                Continue tutorials
              </Button>
              <Button as={Link} size="sm" to="/practice" variant="secondary">
                Solve related problems
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default LearningPaths;
