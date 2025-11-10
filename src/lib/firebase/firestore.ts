import type { ActionResult, JoinRequestPayload } from "@/types";

type ApiRoute = "join" | "project-interest" | "event-rsvp";

const callApi = async (
  route: ApiRoute,
  payload: Record<string, unknown>,
  successMessage: string,
): Promise<ActionResult> => {
  try {
    const response = await fetch(`/api/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as ActionResult;
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data.message ?? "Request failed",
        error: data.error,
      };
    }
    return {
      ok: true,
      message: data.message ?? successMessage,
    };
  } catch (error) {
    console.error(`${route} api error`, error);
    return {
      ok: false,
      message: "Network error. Please retry.",
      error: String(error),
    };
  }
};

export const submitJoinRequest = (payload: JoinRequestPayload) =>
  callApi("join", payload, "Request received.");

export const registerProjectInterest = (projectId: string, userId: string) =>
  callApi(
    "project-interest",
    { projectId, userId },
    "Project lead notified.",
  );

export const rsvpToEvent = (eventId: string, userId: string) =>
  callApi("event-rsvp", { eventId, userId }, "RSVP confirmed.");
