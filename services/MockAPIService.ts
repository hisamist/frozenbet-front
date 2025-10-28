// services/MockAPIService.ts
import { Group, GroupFull, User, Competition, Prediction, Match } from "@/types";
import { mockGroups } from "./MockGroupData";

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

// --- Mock Predictions / Bets ---
const mockBets: Prediction[] = [
  {
    id: 1,
    userId: 1,
    matchId: 101,
    groupId: 1,
    match: {
      id: 101,
      competitionId: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeam: { id: 1, competitionId: 1, name: "Team A", createdAt: new Date().toISOString() },
      awayTeam: { id: 2, competitionId: 1, name: "Team B", createdAt: new Date().toISOString() },
      scheduledDate: "2025-11-01T20:00:00.000Z",
      status: "finished",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Match,
    user: mockUser,
    homeScorePrediction: 2,
    awayScorePrediction: 1,
    pointsEarned: 3,
    predictedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    matchId: 102,
    groupId: 1,
    match: {
      id: 102,
      competitionId: 1,
      homeTeamId: 3,
      awayTeamId: 4,
      homeTeam: { id: 3, competitionId: 1, name: "Team C", createdAt: new Date().toISOString() },
      awayTeam: { id: 4, competitionId: 1, name: "Team D", createdAt: new Date().toISOString() },
      scheduledDate: "2025-11-02T18:30:00.000Z",
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Match,
    user: mockUser,
    homeScorePrediction: 1,
    awayScorePrediction: 1,
    pointsEarned: null,
    predictedAt: new Date().toISOString(),
  },
];

// --- Mock API Service ---
export const MockAPIService = {
  // Auth
  registerUser: async (payload: { username: string; email: string; password: string }) => ({
    user: mockUser,
    token: "mock-jwt-token",
  }),
  loginUser: async (payload: { email: string; password: string }) => ({
    user: mockUser,
    token: "mock-jwt-token",
  }),
  logoutUser: async () => ({ success: true }),
  getUser: async () => mockUser,

  // Groups
  createGroup: async (payload: {
    name: string;
    description?: string;
    competitionId: number;
    visibility: "public" | "private";
  }) => {
    const newGroup: GroupFull = {
      id: mockGroups.length + 1,
      ...payload,
      ownerId: mockUser.id,
      createdAt: new Date().toISOString(),
      owner: mockUser,
      competition: mockCompetition,
      members: [],
      scoringRules: [],
      rankings: [],
    };
    mockGroups.push(newGroup);
    return newGroup;
  },
  getGroups: async () => mockGroups,
  getGroupById: async (groupId: number) => mockGroups.find((g) => g.id === groupId),

  // Predictions / Bets
  makePrediction: async (payload: {
    matchId: number;
    groupId: number;
    homeScorePrediction: number;
    awayScorePrediction: number;
  }) => {
    const prediction: Prediction = {
      id: mockBets.length + 1,
      ...payload,
      userId: mockUser.id,
      predictedAt: new Date().toISOString(),
      user: mockUser,
    };
    mockBets.push(prediction);
    return prediction;
  },
  getBets: async (groupId?: number, matchId?: number) =>
    mockBets.filter(
      (p) => (!groupId || p.groupId === groupId) && (!matchId || p.matchId === matchId)
    ),
  getBetsByGroupId: async (groupId?: number) =>
    mockBets.filter((p) => !groupId || p.groupId === groupId),
  getYourBets: async (userId: number, groupId?: number) =>
    mockBets.filter((p) => p.userId === userId && (!groupId || p.groupId === groupId)),
};
