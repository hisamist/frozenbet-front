import Image from "next/image";

export default function Home() {
  return (
      <div className="flex flex-col w-full max-w-3xl mx-auto py-32 px-4 sm:px-16">
        <h1 className="text-4xl font-bold mb-8">Bienvenue sur FrozenBet</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Contenu principal de la page d’accueil.
        </p>
        {/* Autres sections */}
    </div>
  );
}
