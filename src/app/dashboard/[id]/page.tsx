"use client";

import DashboardPage from "../page";

export default function UserDashboardPage() {
  // Reuse the existing dashboard page UI. The `useAuth` context will control
  // displayed profile; the route param is present for bookmarking/sharing.
  return <DashboardPage />;
}
