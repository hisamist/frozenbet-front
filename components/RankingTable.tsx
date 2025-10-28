import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { getStatisticsByGroupId } from "@/services/APIService";
import { GroupStatistics } from "@/types";

interface RankingTableProps {
  groupId: number;
}

const RankingTable: React.FC<RankingTableProps> = ({ groupId }) => {
  const [data, setData] = useState<GroupStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getStatisticsByGroupId(groupId);
        if (res) {
          setData(res);
          console.log("✅ Group statistics received:", res);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" py={2}>
        ⚠️ {error}
      </Typography>
    );
  }

  if (!data || !data.topPerformers?.length) {
    return (
      <Typography align="center" color="text.secondary" py={2}>
        No statistics available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: "auto", mt: 3, borderRadius: 2 }}>
      <Typography variant="h6" align="center" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        🏆 Group Ranking – {data.groupName}
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell sx={{ color: "white", textAlign: "center", fontWeight: 600 }}>
              Rank
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Player</TableCell>
            <TableCell sx={{ color: "white", textAlign: "right", fontWeight: 600 }}>
              Total Points
            </TableCell>
            <TableCell sx={{ color: "white", textAlign: "right", fontWeight: 600 }}>
              Correct Predictions
            </TableCell>
            <TableCell sx={{ color: "white", textAlign: "right", fontWeight: 600 }}>
              Exact Scores
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.topPerformers.map((player) => (
            <TableRow
              key={player.userId}
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {player.rank <= 3 ? (
                  <span>
                    {player.rank === 1 && "🥇"}
                    {player.rank === 2 && "🥈"}
                    {player.rank === 3 && "🥉"}
                  </span>
                ) : (
                  player.rank
                )}
              </TableCell>

              <TableCell sx={{ fontWeight: 500 }}>{player.username}</TableCell>
              <TableCell align="right">{player.totalPoints}</TableCell>
              <TableCell align="right">{player.correctPredictions}</TableCell>
              <TableCell align="right">{player.totalPredictions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RankingTable;
