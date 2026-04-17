import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";

const BookmarksPage = () => (
  <div className="space-y-8">
    <PageHeader
      eyebrow="Bookmarks"
      title="Reserved for saved lessons and problems."
      description="The route is live and ready for a future bookmarks feature. For now it acts as a non-blank placeholder in the dashboard shell."
    />
    <SectionCard title="Coming Next">
      <p className="text-sm text-slate-500">
        Add a bookmarks collection later if you want users to save tutorials or practice problems.
      </p>
    </SectionCard>
  </div>
);

export default BookmarksPage;
