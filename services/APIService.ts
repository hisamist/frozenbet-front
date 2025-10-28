import axios, { AxiosError } from "axios";

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
  name: string;
  description?: string;
  points: number;
}) => {
  try {
    const res = await api.post(
      `/groups/${payload.groupId}/rules`,
      {
        name: payload.name,
        description: payload.description,
        points: payload.points,
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
    const res = await api.get("/competitions");
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

export const getBets = async (groupId?: number, matchId?: number) => {
  try {
    const res = await api.get("/predictions", {
      params: {
        ...(groupId ? { groupId } : {}),
        ...(matchId ? { matchId } : {}),
      },
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
    });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getYourBets = async (userId: number, groupId?: number) => {
  try {
    const res = await api.get("/predictions", {
      params: {
        userId,
        ...(groupId ? { groupId } : {}),
      },
    });
    return normalizeList(res.data);
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getMatchesByCompetitionId = async (competitionId: number) => {
  // Use configured API base URL instead of Next.js local API route
  const response = await api.get(`/competitions/${competitionId}/matches`);
  return response;
};
