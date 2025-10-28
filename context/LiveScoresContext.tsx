"use client";

import { useAuth } from "@/context/AuthContext";
import { SSEScoreUpdate, useSSELiveScores } from "@/hooks/useSSELiveScores";
import { getBetsByGroupId } from "@/services/APIService";
import { Notification, Prediction } from "@/types";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface LiveScoresContextType {
  matchNotifications: Notification[];
  isConnected: boolean;
  error: Error | null;
  clearNotifications: () => void;
  getUnreadCount: () => number;
  markAllAsRead: () => void;
}

const LiveScoresContext = createContext<LiveScoresContextType | undefined>(undefined);

export const useLiveScores = () => {
  const context = useContext(LiveScoresContext);
  if (!context) {
    throw new Error("useLiveScores must be used within a LiveScoresProvider");
  }
  return context;
};

interface LiveScoresProviderProps {
  children: React.ReactNode;
}

export const LiveScoresProvider: React.FC<LiveScoresProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [matchNotifications, setMatchNotifications] = useState<Notification[]>([]);
  const [userBetMatchIds, setUserBetMatchIds] = useState<number[]>([]);

  // Load user's bet match IDs
  useEffect(() => {
    const loadUserBets = async () => {
      if (!isAuthenticated || !user) {
        console.log("[LiveScores] User not authenticated, clearing bet match IDs");
        setUserBetMatchIds([]);
        return;
      }

      console.log("[LiveScores] Loading user bets for user:", user.username);
      try {
        // Get all user predictions to find which matches they've bet on
        const predictions: Prediction[] = await getBetsByGroupId();
        const matchIds = [...new Set(predictions.map((p) => p.matchId))];
        setUserBetMatchIds(matchIds);
      } catch (err) {
        console.error("[LiveScores] Error loading user bets:", err);
        setUserBetMatchIds([]);
      }
    };

    loadUserBets();
  }, [isAuthenticated, user]);

  // Handle score updates
  const handleScoreUpdate = useCallback((update: SSEScoreUpdate) => {
    console.log("Processing score update:", update);

    // Create a notification for this score update
    const notification: Notification = {
      id: Date.now() + update.matchId, // Generate unique ID
      type: "match_result",
      title:
        update.status === "finished"
          ? "Match terminé !"
          : update.status === "ongoing"
            ? "Score mis à jour"
            : "Match en cours",
      message: `${update.homeTeamName || "Équipe domicile"} ${update.homeScore} - ${update.awayScore} ${update.awayTeamName || "Équipe extérieure"}`,
      isRead: false,
      createdAt: update.timestamp || new Date().toISOString(),
      resultId: update.matchId,
    };

    setMatchNotifications((prev) => {
      // Check if we already have a notification for this match in the last minute
      // to avoid spam
      const oneMinuteAgo = Date.now() - 60000;
      const recentNotification = prev.find(
        (n) =>
          n.resultId === update.matchId &&
          new Date(n.createdAt).getTime() > oneMinuteAgo &&
          n.title === notification.title
      );

      if (recentNotification) {
        // Update existing notification instead of creating new one
        return prev.map((n) => (n.id === recentNotification.id ? notification : n));
      }

      // Add new notification at the beginning
      return [notification, ...prev];
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error("SSE Error:", error);
  }, []);

  // Connect to SSE with user's bet match IDs
  const { isConnected, error } = useSSELiveScores({
    matchIds: userBetMatchIds,
    enabled: isAuthenticated && userBetMatchIds.length > 0,
    onScoreUpdate: handleScoreUpdate,
    onError: handleError,
  });

  const clearNotifications = useCallback(() => {
    setMatchNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return matchNotifications.filter((n) => !n.isRead).length;
  }, [matchNotifications]);

  const markAllAsRead = useCallback(() => {
    setMatchNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const value: LiveScoresContextType = {
    matchNotifications,
    isConnected,
    error,
    clearNotifications,
    getUnreadCount,
    markAllAsRead,
  };

  return <LiveScoresContext.Provider value={value}>{children}</LiveScoresContext.Provider>;
};
