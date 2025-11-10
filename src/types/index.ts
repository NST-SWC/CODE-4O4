export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type MemberRole = "student" | "mentor" | "alumni";

export type JoinRequestPayload = {
  displayName: string;
  email: string;
  phone: string;
  github?: string;
  portfolio?: string;
  interests: string[];
  experience: ExperienceLevel;
  goals: string;
  role: MemberRole;
  availability: string;
};

export type ActionResult = {
  ok: boolean;
  message: string;
  error?: string;
  // Optional user/profile returned by auth-related actions
  user?: ClubUser;
};

export type ClubUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: MemberRole | "admin";
  points: number;
  badges: number;
};

export type FeatureCard = {
  title: string;
  description: string;
  highlight: string;
  icon: string;
};

export type ShowcaseProject = {
  id: string;
  title: string;
  description: string;
  status: "active" | "recruiting" | "waitlist";
  members: number;
  tech: string[];
  owner: string;
};

export type ClubEvent = {
  id: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendees: number;
  type: "workshop" | "hackathon" | "talk";
};

export type CalendarSession = {
  id: string;
  date: string;
  title: string;
  type: string;
  focus: string;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  role: MemberRole | "mentor";
  points: number;
  badges: number;
};

export type AdminRequest = {
  id: string;
  name: string;
  email: string;
  requestedAt: string;
  role: MemberRole;
  interests: string[];
  portfolio: string;
};
