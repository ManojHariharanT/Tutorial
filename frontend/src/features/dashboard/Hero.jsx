import { Link } from "react-router-dom";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";

const Hero = ({ query, onQueryChange, stats }) => (
  <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-surface-900 via-surface-900 to-surface-850 px-6 py-7 shadow-panel sm:px-8 lg:px-10">
    <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_60%)] lg:block" />

    <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
      <div>
        <Badge tone="accent">Learning Platform</Badge>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
          Build, practice, and debug from one deliberate frontend workspace.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          Move through guided tutorials, solve evaluated problems, explore code in a live
          sandbox, and keep your progress visible without leaving the flow.
        </p>

        <div className="mt-6 max-w-xl">
          <Input
            icon={<span className="text-sm">Q</span>}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search the next concept, challenge, or tool"
            value={query}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button as={Link} to="/tutorials" variant="gradient">
            Explore tutorials
          </Button>
          <Button as={Link} to="/practice" variant="secondary">
            Open practice
          </Button>
          <Button as={Link} to="/playground" variant="secondary">
            Launch playground
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Library</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats.tutorialCount}</p>
          <p className="mt-2 text-sm text-slate-400">Structured tutorials available now</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Practice</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats.problemCount}</p>
          <p className="mt-2 text-sm text-slate-400">Coding problems ready to solve</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Acceptance</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats.acceptanceRate}%</p>
          <p className="mt-2 text-sm text-slate-400">Based on your recorded submissions</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Streak</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats.activeStreak}</p>
          <p className="mt-2 text-sm text-slate-400">Days with meaningful learning activity</p>
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
