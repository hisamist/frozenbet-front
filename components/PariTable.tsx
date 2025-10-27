"use client";

import React from "react";
import Image from "next/image";

interface Bet {
  id: number;
  match: string;
  scheduledDate: string;
  predictedScore: string;
  status: "finished" | "active";
  resultId: string;
}

interface PariTableProps {
  bets: Bet[];
  isParticipating: boolean;
}

export default function PariTable({ bets, isParticipating }: PariTableProps) {
  if (!isParticipating) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vos Paris</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Vous devez participer au groupe pour voir vos paris.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vos Paris</h2>
      <table className="min-w-full text-left text-gray-900 dark:text-white">
        <thead>
          <tr>
            <th className="px-2 py-1">Match</th>
            <th className="px-2 py-1">Date</th>
            <th className="px-2 py-1">Prédiction</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet) => (
            <tr key={bet.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-2 py-1">{bet.match}</td>
              <td className="px-2 py-1">{bet.scheduledDate}</td>
              <td className="px-2 py-1">{bet.predictedScore}</td>
              <td className="px-2 py-1">{bet.status}</td>
              <td className="px-2 py-1">
                {bet.status === "finished" ? (
                  <a
                    href={`/result/${bet.resultId}`}
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Voir résultat
                  </a>
                ) : (
                  <button
                    className="px-2 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                    disabled
                  >
                    En cours
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
