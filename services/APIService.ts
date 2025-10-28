import axios, { AxiosError } from "axios";
import { GroupInvitation, Notification } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Normalize list-shaped responses from different API shapes
const normalizeList = (payload: any) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.groups)) return payload.groups;
  return [] as any[];
};

// --------------------
// Axios instance
// --------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // important pour envoyer les cookies HttpOnly si backend les utilise
});

// --------------------
// Error handler
// --------------------
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = (
      error as AxiosError<{ success: boolean; error: { code: string; message: string } }>
    ).response?.data;
    return data?.error?.message || error.message;
  }
  return "Unknown error";
};

// --------------------
// Helper pour endpoints protégés
// --------------------
const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// --------------------
// Auth endpoints
// --------------------
export const registerUser = async (payload: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) => {
  try {
    const res = await api.post("/auth/register", payload);
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const loginUser = async (payload: { email: string; password: string }) => {
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout", {}, { headers: authHeaders() });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getUser = async () => {
  try {
    const res = await api.get("/auth/me"); // backend doit renvoyer user via HttpOnly cookie
    return res.data?.user ?? res.data; // ex: { user: {...} } ou direct user
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Groups endpoints
// --------------------
export const createGroup = async (payload: {
  name: string;
  description?: string;
  competitionId: number;
  visibility: "public" | "private";
}) => {
  try {
    const res = await api.post("/groups", payload, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getGroups = async () => {
  try {
    const res = await api.get("/groups");
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const createRuleByGroupId = async (payload: {
  groupId: number;
  description?: string;
  points: number;
  type: "EXACT_SCORE" | "CORRECT_WINNER" | "CORRECT_DRAW" | "GOAL_DIFFERENCE" | "BOTH_TEAMS_SCORE";
}) => {
  try {
    console.log("Creating rule with payload;", payload);
    const res = await api.post(
      `/groups/${payload.groupId}/rules`,
      {
        description: payload.description,
        points: payload.points,
        ruleType: payload.type,
      },
      { headers: authHeaders() }
    );
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Predictions endpoints
// --------------------
export const makePrediction = async (payload: {
  matchId: number;
  groupId: number;
  homeScorePrediction: number;
  awayScorePrediction: number;
}) => {
  try {
    const res = await api.post("/predictions", payload, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Competitions endpoints
// --------------------
export const getCompetitions = async () => {
  try {
    const res = await api.get("/competitions", { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Extra endpoints to mirror mocks
// --------------------
export const getGroupById = async (groupId: number) => {
  try {
    const res = await api.get(`/groups/${groupId}`);
    // Accept either a direct object or wrapped shapes
    return res.data?.data ?? res.data?.group ?? res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getGroupMembers = async (groupId: number, page?: number, limit?: number) => {
  try {
    const res = await api.get(`/groups/${groupId}/members`, {
      params: {
        ...(page !== undefined ? { page } : {}),
        ...(limit !== undefined ? { limit } : {}),
      },
    });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const joinGroup = async (groupId: number, inviteCode?: string) => {
  try {
    const payload = inviteCode ? { inviteCode } : {};
    const res = await api.post(`/groups/${groupId}/join`, payload, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const leaveGroup = async (groupId: number) => {
  try {
    const res = await api.post(`/groups/${groupId}/leave`, {}, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getBets = async (groupId?: number, matchId?: number) => {
  try {
    const res = await api.get("/predictions", {
      params: {
        ...(groupId ? { groupId } : {}),
        ...(matchId ? { matchId } : {}),
      },
      headers: authHeaders(),
    });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getBetsByGroupId = async (groupId?: number) => {
  try {
    const res = await api.get("/predictions", {
      params: {
        ...(groupId ? { groupId } : {}),
      },
      headers: authHeaders(), // <-- include token
    });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getYourBets = async (userId: number) => {
  try {
    const res = await api.get(`/users/${userId}/predictions`, {
      headers: authHeaders(), // send token
    });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Competitions endpoints
// --------------------

export const getMatchesByCompetitionId = async (competitionId: number) => {
  try {
    // Use configured API base URL instead of Next.js local API route
    const res = await api.get(`/competitions/${competitionId}/matches`);
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Stastics endpoints
// --------------------

export const getStatisticsByGroupId = async (groupId: number) => {
  try {
    // Note: the path should be /statistics/groups/{id}, not /statistics/groups
    const res = await api.get(`/statistics/groups/${groupId}`, {
      headers: authHeaders(), // token for protected route
    });
    // No need to normalize since the response could be empty
    return res.data.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Invitations endpoints
// --------------------
export const sendInvitation = async (payload: { inviteeEmail: string; groupId: number }) => {
  try {
    const res = await api.post("/invitations", payload, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getReceivedInvitations = async () => {
  try {
    const res = await api.get("/invitations/received", { headers: authHeaders() });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getSentInvitations = async () => {
  try {
    const res = await api.get("/invitations/sent", { headers: authHeaders() });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const acceptInvitation = async (token: string) => {
  try {
    const res = await api.post(`/invitations/${token}/accept`, {}, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const rejectInvitation = async (token: string) => {
  try {
    const res = await api.post(`/invitations/${token}/reject`, {}, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const deleteInvitation = async (id: number) => {
  try {
    const res = await api.delete(`/invitations/${id}`, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// --------------------
// Notification utilities
// --------------------
// Convert invitations to notifications
export const convertInvitationToNotification = (invitation: GroupInvitation): Notification => {
  return {
    id: invitation.id,
    type: "invitation",
    title: "Invitation à rejoindre un groupe",
    message: `${invitation.inviter?.username || "Quelqu'un"} vous invite à rejoindre le groupe "${invitation.group?.name || "un groupe"}"`,
    isRead: invitation.status !== "pending",
    createdAt: invitation.createdAt,
    invitationToken: invitation.token,
    invitationId: invitation.id,
    groupId: invitation.groupId,
    groupName: invitation.group?.name,
    inviterUsername: invitation.inviter?.username,
  };
};

// Get all notifications (invitations converted to notifications)
export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    const invitations = await getReceivedInvitations();
    const notifications = invitations.map(convertInvitationToNotification);
    // Sort by date, most recent first
    return notifications.sort(
      (a: Notification, b: Notification) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    throw new Error(handleError(err));
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const notifications = await getAllNotifications();
    return notifications.filter((n) => !n.isRead).length;
  } catch (err) {
    throw new Error(handleError(err));
  }
};
