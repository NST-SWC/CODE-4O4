"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar, Clock, MapPin } from "lucide-react";

interface Session {
  id: string;
  title: string;
  date: string;
  weekday: string;
  topics: string[];
  description?: string;
  duration?: string;
  location?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SessionsManagePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    weekday: "",
    topics: "",
    description: "",
    duration: "90 minutes",
    location: "Online",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (user?.role !== "admin" && user?.role !== "mentor") {
      router.push("/dashboard");
      return;
    }

    fetchSessions();
  }, [isAuthenticated, user, router]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/sessions/all?userId=${user?.id}`);
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

  const handleOpenModal = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title,
        date: session.date,
        weekday: session.weekday || "",
        topics: session.topics.join("\n"),
        description: session.description || "",
        duration: session.duration || "90 minutes",
        location: session.location || "Online",
      });
    } else {
      setEditingSession(null);
      setFormData({
        title: "",
        date: "",
        weekday: "",
        topics: "",
        description: "",
        duration: "90 minutes",
        location: "Online",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const topicsArray = formData.topics.split("\n").filter((t) => t.trim());
      const payload = {
        ...formData,
        topics: topicsArray,
        userId: user?.id,
        ...(editingSession && { sessionId: editingSession.id }),
      };

      const url = "/api/sessions";
      const method = editingSession ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.ok) {
        await fetchSessions();
        handleCloseModal();
      } else {
        alert(result.error || "Failed to save session");
      }
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Failed to save session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      const response = await fetch(
        `/api/sessions?sessionId=${sessionId}&userId=${user?.id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (result.ok) {
        await fetchSessions();
      } else {
        alert(result.error || "Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    }
  };

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "mentor")) {
    return null;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Sessions</h1>
            <p className="text-white/60 mt-2">
              Create and manage club sessions (Admin & Mentor only)
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/60">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            No sessions found. Create your first session!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{session.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {session.date} ({session.weekday})
                      </span>
                      {session.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.duration}
                        </span>
                      )}
                    </div>
                    {session.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-white/60">
                        <MapPin className="h-4 w-4" />
                        {session.location}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(session)}
                      className="p-2 rounded-lg hover:bg-white/10 transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {session.description && (
                  <p className="text-sm text-white/70">{session.description}</p>
                )}

                {session.topics && session.topics.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-2">Topics:</p>
                    <ul className="space-y-1 text-sm text-white/60">
                      {session.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingSession ? "Edit Session" : "Create New Session"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Weekday</label>
                  <input
                    type="text"
                    value={formData.weekday}
                    onChange={(e) =>
                      setFormData({ ...formData, weekday: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    placeholder="e.g., Wednesday"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    placeholder="e.g., 90 minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    placeholder="e.g., Online"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 h-24 resize-none"
                  placeholder="Brief description of the session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Topics (one per line)
                </label>
                <textarea
                  value={formData.topics}
                  onChange={(e) =>
                    setFormData({ ...formData, topics: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 h-32 resize-none"
                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingSession
                    ? "Update Session"
                    : "Create Session"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
