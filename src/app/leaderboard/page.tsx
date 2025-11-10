import Link from "next/link";
import { leaderboardPreview } from "@/lib/data";
import { PageContainer } from "@/components/shared/page-container";
import { PageIntro } from "@/components/shared/page-intro";

const LeaderboardPage = () => (
  <PageContainer>
    <PageIntro
      badge="LEADERBOARD"
      title="Season rankings & badge wall"
      description="Points are awarded for code shipped, mentorship hours, event hosting, and impact updates. Full scoring unlocks after the next release."
      actions={
        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-emerald-300/60 hover:text-white"
        >
          ← Back home
        </Link>
      }
    />

    <div className="mt-10 grid gap-4">
      {leaderboardPreview.map((entry) => (
        <article
          key={entry.id}
          className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
            #{entry.rank}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{entry.name}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              {entry.role}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-emerald-200">
              {entry.points}
            </p>
            <p className="text-xs text-white/60">{entry.badges} badges</p>
          </div>
        </article>
      ))}
    </div>

    <div className="mt-8 rounded-3xl border border-dashed border-white/20 p-5 text-sm text-white/70">
      Leaderboard 2.0 is in the works – expect squad-based scoring, streaks,
      and contribution tracking once the backend sync ships.
    </div>
  </PageContainer>
);

export default LeaderboardPage;
