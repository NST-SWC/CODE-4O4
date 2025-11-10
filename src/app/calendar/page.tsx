import Link from "next/link";
import { calendarSessions } from "@/lib/data";
import { PageContainer } from "@/components/shared/page-container";
import { PageIntro } from "@/components/shared/page-intro";
import { formatDate } from "@/lib/utils";

const CalendarPage = () => (
  <PageContainer>
    <PageIntro
      badge="CALENDAR"
      title="Sprint rituals & study sessions"
      description="Every week features squad reviews, learning labs, and leadership firesides. Sync this list with your personal calendar once you’re logged in."
      actions={
        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-emerald-300/60 hover:text-white"
        >
          ← Back home
        </Link>
      }
    />

    <div className="mt-10 space-y-4">
      {calendarSessions.map((session) => (
        <article
          key={session.id}
          className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center"
        >
          <div className="rounded-2xl border border-white/10 px-5 py-4 text-center">
            <p className="text-3xl font-semibold text-emerald-200">
              {new Date(session.date).getDate()}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              {formatDate(session.date, { month: "short" })}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{session.title}</p>
            <p className="text-sm text-white/60">{session.focus}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            {session.type}
          </span>
        </article>
      ))}
    </div>
  </PageContainer>
);

export default CalendarPage;
