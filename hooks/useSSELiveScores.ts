"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface SSEScoreUpdate {
  matchId: number;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "ongoing" | "finished";
  homeTeamName?: string;
  awayTeamName?: string;
  timestamp: string;
}

interface UseSSELiveScoresOptions {
  matchIds?: number[];
  enabled?: boolean;
  onScoreUpdate?: (update: SSEScoreUpdate) => void;
  onError?: (error: Error) => void;
}

export const useSSELiveScores = ({
  matchIds,
  enabled = true,
  onScoreUpdate,
  onError,
}: UseSSELiveScoresOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      const err = new Error("No authentication token found");
      setError(err);
      if (onError) onError(err);
      return;
    }

    // Build URL with matchIds if provided
    const url = new URL("/sse/live-scores", API_BASE_URL);
    if (matchIds && matchIds.length > 0) {
      url.searchParams.set("matchIds", matchIds.join(","));
    }

    // EventSource doesn't support custom headers, so we pass token as query param
    // Note: Backend needs to accept token via query param for SSE
    url.searchParams.set("token", token);

    const eventSource = new EventSource(url.toString());
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("connected", (event) => {
      console.log("SSE Connected:", event.data);
      setIsConnected(true);
      setError(null);
    });

    eventSource.addEventListener("score_update", (event) => {
      try {
        const update: SSEScoreUpdate = JSON.parse(event.data);
        console.log("Score update received:", update);
        if (onScoreUpdate) {
          onScoreUpdate(update);
        }
      } catch (err) {
        console.error("Error parsing score update:", err);
      }
    });

    eventSource.addEventListener("match_finished", (event) => {
      try {
        const update: SSEScoreUpdate = JSON.parse(event.data);
        console.log("Match finished:", update);
        if (onScoreUpdate) {
          onScoreUpdate(update);
        }
      } catch (err) {
        console.error("Error parsing match finished event:", err);
      }
    });

    eventSource.onerror = (event) => {
      console.error("SSE Error:", event);
      const err = new Error("SSE connection error");
      setError(err);
      setIsConnected(false);
      if (onError) onError(err);

      // EventSource will automatically try to reconnect
      // Close and cleanup only if we want to stop
    };

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setIsConnected(false);
      }
    };
  }, [enabled, matchIds?.join(","), onScoreUpdate, onError]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  return {
    isConnected,
    error,
    disconnect,
  };
};
