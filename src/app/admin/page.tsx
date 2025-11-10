import Link from "next/link";
import { adminQueue } from "@/lib/data";
import RequestCard from "@/components/admin/request-card";
import { PageContainer } from "@/components/shared/page-container";
import { PageIntro } from "@/components/shared/page-intro";

const AdminPage = () => (
  <PageContainer>
    <PageIntro
      badge="ADMIN PORTAL"
      title="Member approvals & reviews"
      description="Track pending join requests, review interest tags, and approve contributors once you’ve met them."
      actions={
        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-emerald-300/60 hover:text-white"
        >
          ← Back home
        </Link>
      }
    />

    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {adminQueue.map((request) => (
        <div key={request.id}>
          <RequestCard request={request} />
        </div>
      ))}
    </div>

    <div className="mt-8 rounded-3xl border border-dashed border-white/20 p-5 text-sm text-white/70">
      Automate this flow by connecting the form submissions (Firestore) to your
      admin dashboard, or export CSVs for offline processing.
    </div>
  </PageContainer>
);

export default AdminPage;
