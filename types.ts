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
type RuleType =
  | "EXACT_SCORE"
  | "CORRECT_WINNER"
  | "CORRECT_DRAW"
  | "GOAL_DIFFERENCE"
  | "BOTH_TEAMS_SCORE";
export interface GroupScoringRule {
  id: number;
  groupId: number;
  ruleDescription?: string | null;
  points: number;
  createdAt: string;
  ruleType: RuleType;
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

// Notification System
export type NotificationType = "invitation" | "match_result" | "group_update" | "general";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // Optional fields based on type
  invitationToken?: string; // for invitation type
  invitationId?: number; // for invitation type
  groupId?: number; // for invitation or group_update type
  groupName?: string; // for invitation or group_update type
  inviterUsername?: string; // for invitation type
  resultId?: number; // for match_result type
  link?: string; // optional link to navigate to
}

export interface TopPerformer {
  userId: number;
  username: string;
  rank: number;
  totalPoints: number;
  correctPredictions: number;
  totalPredictions: number;
}

export interface RecentActivity {
  predictionId: number;
  userId: number;
  username: string;
  match: string;
  prediction: string;
  pointsEarned: number | null;
  predictedAt: Date;
}

export interface GroupStatistics {
  groupId: number;
  groupName: string;
  totalMembers: number;
  totalPredictions: number;
  topPerformers: TopPerformer[];
  recentActivity: RecentActivity[];
}
