// ==========================
// USERS
// ==========================
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string; // ISO date
}

// ==========================
// COMPETITIONS
// ==========================
export interface Competition {
  id: number;
  theme_id?: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  season?: string;
  status?: string;
  logo_url?: string;
  external_api_id?: string;
  created_at: string;
}

// ==========================
// TEAMS
// ==========================
export interface Team {
  id: number;
  competition_id: number;
  name: string;
  short_name?: string;
  logo_url?: string;
  country?: string;
  external_api_id?: string;
  created_at: string;
}

// ==========================
// MATCHES
// ==========================
export interface Match {
  id: number;
  competition_id: number;
  home_team_id: number;
  away_team_id: number;
  scheduled_date: string;
  status?: string;
  home_score?: number;
  away_score?: number;
  round?: string;
  location?: string;
  external_api_id?: string;
  live_updated_at?: string;
  created_at: string;
  updated_at?: string;
}

// ==========================
// GROUPS
// ==========================
export interface Group {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  competition_id?: number;
  visibility: "private" | "public";
  invite_code: string;
  max_members?: number;
  created_at: string;
}

// ==========================
// GROUP_SCORING_RULES
// ==========================
export interface GroupScoringRule {
  id: number;
  group_id: number;
  rule_type: string;
  rule_description?: string;
  points: number;
  created_at: string;
}

// ==========================
// GROUP_MEMBERS
// ==========================
export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  role: "owner" | "admin" | "member";
  joined_at: string;
  total_points?: number;
}

// ==========================
// PREDICTIONS
// ==========================
export interface Prediction {
  id: number;
  user_id: number;
  match_id: number;
  group_id: number;
  home_score_prediction: number;
  away_score_prediction: number;
  predicted_at: string;
  points_earned?: number;
  is_locked: boolean;
}

// ==========================
// GROUP_INVITATIONS
// ==========================
export interface GroupInvitation {
  id: number;
  group_id: number;
  inviter_id: number;
  invitee_email: string;
  invitee_user_id?: number;
  status: string;
  token: string;
  expires_at: string;
  created_at: string;
  responded_at?: string;
}

// ==========================
// GROUP_RANKINGS
// ==========================
export interface GroupRanking {
  id: number;
  group_id: number;
  user_id: number;
  total_points: number;
  total_predictions: number;
  correct_predictions: number;
  exact_scores: number;
  rank: number;
  previous_rank?: number;
}

// ==========================
// RELATION TYPES (optionnels)
// ==========================

export interface GroupWithRelations extends Group {
  owner?: User;
  members?: GroupMember[];
  competition?: Competition;
  rules?: GroupScoringRule[];
  invitations?: GroupInvitation[];
  rankings?: GroupRanking[];
  predictions?: Prediction[];
}
