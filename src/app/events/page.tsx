import Link from "next/link";
import { upcomingEvents } from "@/lib/data";
import { PageContainer } from "@/components/shared/page-container";
import { PageIntro } from "@/components/shared/page-intro";
import { formatDate } from "@/lib/utils";

const EventsPage = () => (
  <PageContainer>
    <PageIntro
      badge="EVENTS"
      title="Workshops, hack nights & firesides"
      description="Track every club-hosted session. RSVP directly from the dashboard after logging in."
      actions={
        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-emerald-300/60 hover:text-white"
        >
          ← Back home
        </Link>
      }
    />

    <div className="mt-10 grid gap-6">
      {upcomingEvents.map((event) => (
        <article
          key={event.id}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">
              {event.type}
            </span>
            <span>
              {formatDate(event.date, { weekday: "short", month: "short", day: "numeric" })} ·{" "}
              {event.time}
            </span>
            <span>{event.location}</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold">{event.title}</h2>
          <p className="mt-2 text-sm text-white/70">{event.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span>
              Seats: {event.attendees}/{event.capacity}
            </span>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-emerald-300/70 hover:text-white"
            >
              RSVP via portal
            </Link>
          </div>
        </article>
      ))}
    </div>
  </PageContainer>
);

export default EventsPage;
