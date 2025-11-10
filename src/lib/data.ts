import type {
  AdminRequest,
  CalendarSession,
  ClubEvent,
  FeatureCard,
  LeaderboardEntry,
  ShowcaseProject,
} from "@/types";

export const heroStats = [
  { label: "Active Members", value: "320+", detail: "product builders" },
  { label: "Projects Shipped", value: "58", detail: "community builds" },
  { label: "Workshops / yr", value: "42", detail: "hands-on labs" },
  { label: "Partner Mentors", value: "24", detail: "industry experts" },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Collaborative Projects",
    description:
      "Squad up with designers, devs, and mentors to ship community products with modern stacks.",
    highlight: "Ship multi-week builds with real users.",
    icon: "Code2",
  },
  {
    title: "Tech Events",
    description:
      "Workshops, hack nights, and lightning talks crafted by engineers, product folks, and alumni.",
    highlight: "Stay future-proof with weekly sessions.",
    icon: "CalendarDays",
  },
  {
    title: "Expert Mentorship",
    description:
      "Access mentors from FAANG, YC startups, and research labs for reviews, mock interviews, and more.",
    highlight: "1:1 office hours + async feedback.",
    icon: "Sparkles",
  },
  {
    title: "Gamified Growth",
    description:
      "Earn badges, stack points, and climb custom leaderboards that celebrate deep work and impact.",
    highlight: "Track learning across seasons.",
    icon: "Trophy",
  },
];

export const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Firebase",
  "Node.js",
  "Python",
  "MongoDB",
  "Docker",
  "AWS",
  "GitHub",
];

export const journeySteps = [
  {
    title: "01 · Submit Your Story",
    summary:
      "Introduce yourself, your stack, and what you want to build with the club.",
    micro: ["Pick interest tracks", "Share GitHub or dribbble", "Tell us your goal"],
  },
  {
    title: "02 · Login & Explore",
    summary:
      "Track project needs, request to join squads, and RSVP to events through the portal.",
    micro: ["Review live projects", "Claim open tasks", "Track deliverables"],
  },
  {
    title: "03 · Collaborate & Earn",
    summary:
      "Pair with mentors, contribute code, get awarded points, and climb the leaderboard.",
    micro: ["Sync with mentors", "Demo your work", "Unlock club perks"],
  },
];

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "ai-playground",
    title: "AI Playground Platform",
    description:
      "A web-based suite of AI-assisted tools featuring real-time collaboration and voice inputs.",
    status: "active",
    members: 8,
    tech: ["Next.js", "Firebase", "OpenAI", "Tailwind"],
    owner: "Helena • Mentor",
  },
  {
    id: "campus-connect",
    title: "Campus Connect App",
    description:
      "Mobile-first social layer for campus clubs with event drops, spaces, and leaderboards.",
    status: "recruiting",
    members: 5,
    tech: ["React Native", "Supabase", "Expo"],
    owner: "Aditya • Core Team",
  },
  {
    id: "ethos",
    title: "Ethos Design System",
    description:
      "Unified design kit with token automation, figma plugins, and accessible web components.",
    status: "waitlist",
    members: 11,
    tech: ["Figma", "Storybook", "Radix"],
    owner: "Mira • Design Lead",
  },
];

export const upcomingEvents: ClubEvent[] = [
  {
    id: "react-ignite",
    title: "React Ignite Workshop",
    summary: "Advanced patterns with React Server Components + streaming UI.",
    date: "2025-01-18",
    time: "18:00",
    location: "Innovation Lab · Block C",
    capacity: 40,
    attendees: 28,
    type: "workshop",
  },
  {
    id: "hack-impact",
    title: "Hack for Impact 2025",
    summary: "48-hour campus hackathon building tools for education & sustainability.",
    date: "2025-02-02",
    time: "09:00",
    location: "Makerspace Arena",
    capacity: 120,
    attendees: 76,
    type: "hackathon",
  },
  {
    id: "mentor-round",
    title: "Mentor Roundtables",
    summary: "Ask-me-anything with alumni devs from YC-backed startups.",
    date: "2025-01-26",
    time: "17:30",
    location: "Studio 3 • Dev Hub",
    capacity: 25,
    attendees: 19,
    type: "talk",
  },
];

export const calendarSessions: CalendarSession[] = [
  {
    id: "session-1",
    date: "2025-01-14",
    title: "Velocity Sprint Review",
    type: "Sprint Sync",
    focus: "Project demos + peer review",
  },
  {
    id: "session-2",
    date: "2025-01-16",
    title: "AI Builder Lab",
    type: "Hands-on Lab",
    focus: "RAG pipelines with Firebase",
  },
  {
    id: "session-3",
    date: "2025-01-21",
    title: "Design Systems Guild",
    type: "Guild Meet",
    focus: "Tokens, theming, automation",
  },
  {
    id: "session-4",
    date: "2025-01-25",
    title: "Founder Fireside",
    type: "Speaker Series",
    focus: "Shipping in public",
  },
];

export const leaderboardPreview: LeaderboardEntry[] = [
  { id: "tania", rank: 1, name: "Tania Builder", role: "mentor", points: 1520, badges: 6 },
  { id: "irfan", rank: 2, name: "Irfan Shah", role: "student", points: 1310, badges: 4 },
  { id: "meera", rank: 3, name: "Meera K", role: "student", points: 1190, badges: 3 },
];

export const adminQueue: AdminRequest[] = [
  {
    id: "req-1",
    name: "Sonia Dsouza",
    email: "sonia@campus.dev",
    requestedAt: "2025-01-10",
    role: "student",
    interests: ["AI/ML", "Design Systems", "Community"],
    portfolio: "https://github.com/soniadcodes",
  },
  {
    id: "req-2",
    name: "Marcus Hill",
    email: "marcus@campus.dev",
    requestedAt: "2025-01-09",
    role: "mentor",
    interests: ["Product Strategy", "Infrastructure"],
    portfolio: "https://marcus.design",
  },
];

export const availableInterests = [
  "AI/ML",
  "Web Apps",
  "Design Systems",
  "Product Strategy",
  "Mobile",
  "DevOps",
  "Cloud",
  "Cybersecurity",
];
