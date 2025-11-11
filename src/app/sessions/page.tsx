"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/shared/page-container";
import { PageIntro } from "@/components/shared/page-intro";
import { formatDate } from "@/lib/utils";

const sessionModules = [
  {
    id: "html-foundations",
    title: "HTML Foundations",
    date: "2025-11-12",
    weekday: "Wednesday",
    topics: [
      "What is HTML & hyper text",
      "Inline vs block elements",
      "Semantic tags & table spans",
      "Fun project briefing (bhailang, dev club site)",
      "Box model primer",
    ],
  },
  {
    id: "css-core-01",
    title: "CSS Core Concepts I",
    date: "2025-11-14",
    weekday: "Friday",
    topics: [
      "Inline / internal / external CSS",
      "Structuring styles for club repos",
      "Linking multiple style sheets",
      "Hands-on: brand tokens warm-up",
    ],
  },
  {
    id: "css-core-02",
    title: "CSS Core Concepts II",
    date: "2025-11-19",
    weekday: "Wednesday",
    topics: [
      "Classes vs IDs & specificity",
      "Preference / priority rules",
      "Creating shapes (circle demo)",
      "Mini-lab: landing page hero",
    ],
  },
];

const SessionsPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        const result = await response.json();
        if (result.ok) {
          setSessions(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
  <PageContainer>
    <PageIntro
      badge="CLUB SESSIONS"
      title="Wednesday & Friday build nights"
      description="Live workshops start 12 November. We meet twice a week to cover HTML, CSS, and front-end fundamentals before jumping into collaborative projects."
      actions={
        <Link
          href="/events"
          className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-emerald-300/60 hover:text-white"
        >
          View events
        </Link>
      }
    />

    <section className="mt-10 space-y-6">
      <h2 className="text-2xl font-semibold">Upcoming calendar</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full text-center text-white/60 py-12">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="col-span-full text-center text-white/60 py-12">No upcoming sessions</div>
        ) : (
          sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                <span>{session.type}</span>
                <span>{formatDate(session.date, { weekday: "long" })}</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold">{session.title}</h3>
              <p className="text-sm text-white/70">{session.description || session.focus || 'Workshop session'}</p>
              <p className="mt-4 text-xs text-white/50">
                Starts {formatDate(session.date, { month: "long", day: "numeric" })}
            </p>
          </article>
        ))}
      </div>
    </section>

    <section className="mt-12 space-y-6">
      <h2 className="text-2xl font-semibold">Session breakdown</h2>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full border-collapse text-left text-sm text-white/80">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-white/60">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Topics</th>
            </tr>
          </thead>
          <tbody>
            {sessionModules.map((mod) => (
              <tr
                key={mod.id}
                className="border-t border-white/10 [&:nth-child(even)]:bg-white/3"
              >
                <td className="px-4 py-4 align-top text-white/60">
                  {formatDate(mod.date, { month: "short", day: "numeric" })}
                  <br />
                  <span className="text-xs">{mod.weekday}</span>
                </td>
                <td className="px-4 py-4 align-top font-semibold">{mod.title}</td>
                <td className="px-4 py-4">
                  <ul className="list-disc pl-5 text-white/70">
                    {mod.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </PageContainer>
);

export default SessionsPage;
