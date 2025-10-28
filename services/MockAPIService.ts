// services/MockAPIService.ts
import { Group, User, Competition, Prediction } from "@/types";

// --- Mock data ---
const mockUser: User = {
  id: 1,
  username: "johnwick",
  email: "john@example.com",
  passwordHash: "hashed_password",
  firstName: "John",
  lastName: "Wick",
  createdAt: new Date().toISOString(),
};

const mockCompetition: Competition = {
  id: 1,
  themeId: 1,
  name: "Premier League",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  status: "upcoming",
  createdAt: new Date().toISOString(),
};

const mockGroups: Group[] = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  name: `Groupe ${i + 1}`,
  description: `Description du groupe ${i + 1}`,
  ownerId: mockUser.id,
  competitionId: mockCompetition.id,
  visibility: i % 2 === 0 ? "public" : "private",
  inviteCode: `INVITE${i + 1}`,
  createdAt: new Date().toISOString(),
  owner: mockUser,
  competition: mockCompetition,
}));

const mockPredictions: Prediction[] = [
  {
    id: 1,
    userId: mockUser.id,
    matchId: 1,
    groupId: 1,
    homeScorePrediction: 2,
    awayScorePrediction: 1,
    predictedAt: new Date().toISOString(),
    user: mockUser,
  },
];

// --- Mock API Service ---
export const MockAPIService = {
  // Auth
  registerUser: async (payload: { username: string; email: string; password: string }) => {
    console.log("Mock registerUser", payload);
    return { user: mockUser, token: "mock-jwt-token" };
  },

  loginUser: async (payload: { email: string; password: string }) => {
    console.log("Mock loginUser", payload);
    return { user: mockUser, token: "mock-jwt-token" };
  },

  logoutUser: async () => {
    console.log("Mock logoutUser");
    return { success: true };
  },

  getUser: async () => {
    console.log("Mock getUser");
    return mockUser;
  },

  // Groups
  createGroup: async (payload: {
    name: string;
    description?: string;
    competitionId: number;
    visibility: "public" | "private";
  }) => {
    console.log("Mock createGroup", payload);
    const newGroup: Group = {
      id: mockGroups.length + 1,
      ...payload,
      ownerId: mockUser.id,
      createdAt: new Date().toISOString(),
      owner: mockUser,
      competition: mockCompetition,
    };
    mockGroups.push(newGroup);
    return newGroup;
  },

  getGroups: async () => {
    console.log("Mock getGroups");
    return mockGroups;
  },

  getGroupById: async (groupId: number) => {
    console.log("Mock getGroupById", groupId);
    return mockGroups.find((g) => g.id === groupId);
  },

  // Predictions
  makePrediction: async (payload: {
    matchId: number;
    groupId: number;
    homeScorePrediction: number;
    awayScorePrediction: number;
  }) => {
    console.log("Mock makePrediction", payload);
    const prediction: Prediction = {
      id: mockPredictions.length + 1,
      ...payload,
      userId: mockUser.id,
      predictedAt: new Date().toISOString(),
      user: mockUser,
    };
    mockPredictions.push(prediction);
    return prediction;
  },

  getPredictions: async (groupId?: number, matchId?: number) => {
    console.log("Mock getPredictions", { groupId, matchId });
    return mockPredictions.filter(
      (p) => (!groupId || p.groupId === groupId) && (!matchId || p.matchId === matchId)
    );
  },
};
