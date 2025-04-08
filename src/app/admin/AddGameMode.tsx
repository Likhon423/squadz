"use client";

import { useState, useEffect } from "react";
import { getGames, createGameMode } from "@/lib/actions";
import { useRouter } from "next/navigation";

const AddGameMode = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [gameModeName, setGameModeName] = useState<string>("");
  const [members, setMembers] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const fetchedGames = await getGames();
        setGames(fetchedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const handleGameSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame || !gameModeName || members <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      await createGameMode(selectedGame, gameModeName, members);
      router.push("/");
    } catch (error) {
      setError("Error creating game mode.");
    }
  };

  return (
    <div className="flex flex-col py-6 px-8 gap-6 bg-white rounded-lg shadow-lg max-w-xl mx-auto text-black">
      <div className="text-3xl text-center font-semibold text-gray-800">
        Add New Game Mode
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="gameSelect"
            className="text-lg font-medium text-gray-700"
          >
            Select Game
          </label>
          <select
            id="gameSelect"
            className="mt-2 p-3 rounded-lg border border-gray-300 text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleGameSelect}
            value={selectedGame ?? ""}
          >
            <option value="" disabled>
              Select a game
            </option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="gameModeName"
            className="text-lg font-medium text-gray-700"
          >
            Game Mode Name
          </label>
          <input
            type="text"
            id="gameModeName"
            placeholder="Enter game mode name"
            className="ring-1 ring-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full"
            value={gameModeName}
            onChange={(e) => setGameModeName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="members"
            className="text-lg font-medium text-gray-700"
          >
            Number of Members
          </label>
          <input
            type="number"
            id="members"
            placeholder="Number of members"
            className="ring-1 ring-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full"
            value={members}
            onChange={(e) => setMembers(Number(e.target.value))}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-red-500 text-white text-lg rounded-lg px-8 py-3 hover:bg-red-600 transition-all duration-300"
          >
            Create Game Mode
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGameMode;
