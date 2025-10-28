import { Group } from "@/types";
import Link from "next/link";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import { getIconColorById } from "@/colors";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const iconColor = getIconColorById(group.id);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden w-full max-w-lg transition-transform hover:scale-[1.02] duration-200">
      {/* Icône hockey centrée */}
      <div className="relative h-40 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <SportsHockeyIcon sx={{ fontSize: 120, color: iconColor }} />
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{group.name}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{group.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Created at: {new Date(group.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Visibility: <span className="capitalize">{group.visibility}</span>
        </p>

        {/* Bouton */}
        <Link
          href={`/group/${group.id}`}
          className="mt-2 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center"
        >
          View Group
        </Link>
      </div>
    </div>
  );
}
