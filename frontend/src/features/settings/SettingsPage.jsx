import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";

const SettingsPage = () => (
  <div className="space-y-8">
    <PageHeader
      eyebrow="Settings"
      title="Profile and workspace settings placeholder."
      description="This keeps navigation complete and gives you a clean place to add account preferences later."
    />
    <SectionCard title="Current Scope">
      <p className="text-sm text-slate-500">
        Authentication, tutorials, practice, playground, and progress are fully wired. Settings can
        be layered on later without changing the layout architecture.
      </p>
    </SectionCard>
  </div>
);

export default SettingsPage;
