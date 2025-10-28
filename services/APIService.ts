import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// --------------------
// Axios instance
// --------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // <-- important pour envoyer les cookies HttpOnly
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
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found for logout");

    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// --------------------
// Get current logged-in user
// --------------------
export const getUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data; // ex: { user: {...} }
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
    const res = await api.post("/groups", payload);
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};

export const getGroups = async () => {
  try {
    const res = await api.get("/groups");
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
    const res = await api.post("/predictions", payload);
    return res.data;
  } catch (err) {
    throw new Error(handleError(err));
  }
};
