"use client";

import { getCompetitions } from "@/services/APIService";
import { Competition } from "@/types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "./Loading";

interface CompetitionSelectProps {
  value: number | "";
  onChange: (value: number) => void;
}

export default function CompetitionSelect({ value, onChange }: CompetitionSelectProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await getCompetitions();
        setCompetitions(res.data || []); // <- Ici on prend le tableau
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);
  if (loading) return <Loading message="Loading competitions..." />;

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="competition-label">Compétition</InputLabel>
      <Select
        labelId="competition-label"
        value={value}
        label="Compétition"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {competitions?.map((comp) => (
          <MenuItem key={comp.id} value={comp.id}>
            {comp.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
