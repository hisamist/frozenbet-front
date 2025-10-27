import { Group } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface GroupCardProps {
  group: Group;
}

const randomImages = [
  "/images/group1.jpg",
  "/images/group2.jpg",
  "/images/group3.jpg",
  "/images/group4.jpg",
];

export default function GroupCard({ group }: GroupCardProps) {
  const imageUrl = randomImages[Math.floor(Math.random() * randomImages.length)];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden w-full max-w-sm">
      {/* Image */}
      <div className="relative h-40 w-full">
        <Image src={imageUrl} alt={group.name} fill className="object-cover" />
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{group.name}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{group.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Max member: {group.max_members}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Visibility: {group.visibility}
        </p>

        {/* Bouton redirige vers /group/id */}
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
