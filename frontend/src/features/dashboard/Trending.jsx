import { Link } from "react-router-dom";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";

const Trending = ({ items }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-white">Trending now</h2>
        <p className="mt-1 text-sm text-slate-400">
          High-signal tutorials, problems, and tools learners are using this week.
        </p>
      </div>
      <Link className="text-sm font-semibold text-accent-200" to="/tutorials">
        View all content
      </Link>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <Link key={item.id} to={item.path}>
          <Card className="h-full transition duration-200 hover:-translate-y-1">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge tone="neutral">{item.type}</Badge>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.metric}
                </span>
              </div>
              <CardTitle className="mt-3">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm leading-7 text-slate-400">{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} tone="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

export default Trending;
