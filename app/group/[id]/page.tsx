import { useParams } from "next/navigation";

export default function UserPage() {
  const params = useParams();
  const groupId = params.id; // récupère l'id de l'URL

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">
        Group ID: {groupId}
      </h1>
      <p>Bienvenue sur la page de group {groupId} !</p>
    </div>
  );
}
