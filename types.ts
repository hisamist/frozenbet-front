// =========================
// Core User Model
// =========================
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string; // ISO date string
}

// =========================
// Competition
// =========================
export interface Competition {
  id: number;
  themeId: number;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  season?: string | null;
  status: "upcoming" | "ongoing" | "finished" | string;
  createdAt: string;
}

// =========================
// Team
// =========================
export interface Team {
  id: number;
  competitionId: number;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;
  country?: string | null;
  externalApiId?: string | null;
  createdAt: string;

  competition?: Competition; // optional relation
}

// =========================
// Match
// =========================
export interface Match {
  id: number;
  competitionId: number;
  homeTeamId: number;
  awayTeamId: number;
  scheduledDate: string;
  status: "scheduled" | "ongoing" | "finished" | string;
  homeScore?: number | null;
  awayScore?: number | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;

  competition?: Competition;
  homeTeam?: Team;
  awayTeam?: Team;
}

// =========================
// Group
// =========================
export interface Group {
  id: number;
  name: string;
  description?: string | null;
  ownerId: number;
  competitionId: number;
  visibility: "private" | "public";
  inviteCode?: string | null;
  createdAt: string;

  owner?: User;
  competition?: Competition;
}

// =========================
// Group Scoring Rules
// =========================
export interface GroupScoringRule {
  id: number;
  groupId: number;
  ruleDescription?: string | null;
  points: number;
  createdAt: string;

  group?: Group;
}

// =========================
// Group Members
// =========================
export interface GroupMember {
  id: number;
  groupId: number;
  userId: number;
  role: "member" | "admin" | "owner";
  joinedAt: string;
  totalPoints: number;

  user?: User;
  group?: Group;
}

// =========================
// Predictions
// =========================
export interface Prediction {
  id: number;
  userId: number;
  matchId: number;
  groupId: number;
  homeScorePrediction: number;
  awayScorePrediction: number;
  predictedAt: string;
  pointsEarned?: number | null;

  user?: User;
  match?: Match;
  group?: Group;
}

// =========================
// Group Invitations
// =========================
export interface GroupInvitation {
  id: number;
  groupId: number;
  inviterId: number;
  inviteeEmail: string;
  inviteeUserId?: number | null;
  status: "pending" | "accepted" | "declined" | string;
  token: string;
  expiresAt: string;
  createdAt: string;
  respondedAt?: string | null;

  group?: Group;
  inviter?: User;
  inviteeUser?: User;
}

// =========================
// Group Rankings
// =========================
export interface GroupRanking {
  id: number;
  groupId: number;
  userId: number;
  totalPoints: number;
  totalPredictions: number;
  correctPredictions: number;
  rank?: number | null;
  previousRank?: number | null;

  group?: Group;
  user?: User;
}

// =========================
// Example Composite Types
// =========================

// Group with all nested relations (useful for dashboards)
export interface GroupFull extends Group {
  members?: GroupMember[];
  scoringRules?: GroupScoringRule[];
  rankings?: GroupRanking[];
  invitations?: GroupInvitation[];
}

// Match with predictions from a specific group
export interface MatchWithPredictions extends Match {
  predictions?: Prediction[];
}

export interface Notification {
  resultId: number;
  message: string;
}
