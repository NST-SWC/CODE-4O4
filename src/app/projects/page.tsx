import Link from "next/link";
import { showcaseProjects } from "@/lib/data";
import { PageContainer } from "@/components/shared/page-container";
import { PageIntro } from "@/components/shared/page-intro";

const ProjectsPage = () => (
  <PageContainer>
    <PageIntro
      badge="PROJECTS"
      title="Collaborative builds & squads"
      description="The Dev Club pairs members with active product squads. Browse live initiatives, stacks, and open roles."
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
      {showcaseProjects.map((project) => (
        <article
          key={project.id}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">{project.title}</h2>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs capitalize text-white/70">
              {project.status}
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">
              {project.members} members
            </span>
          </div>
          <p className="mt-3 text-sm text-white/70">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 px-3 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span>Owner: {project.owner}</span>
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              {project.status === "recruiting"
                ? "New contributors welcome"
                : "Core team active"}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#join"
              className="rounded-full bg-gradient-to-r from-[#00f5c4] to-[#00c2ff] px-5 py-2 text-sm font-medium text-black transition hover:opacity-90"
            >
              Request to join
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-emerald-300/50"
            >
              View dashboard
            </Link>
          </div>
        </article>
      ))}
    </div>
  </PageContainer>
);

export default ProjectsPage;
