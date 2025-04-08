"use client";

import { useState } from "react";
import Image from "next/image";
import FollowButton from "./FollowButton";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  img: string | null;
};

const GamesWrapper = ({
  allGames,
  followedGames,
}: {
  allGames: Game[];
  followedGames: Game[];
}) => {
  const [selectedOption, setSelectedOption] = useState<"all" | "followed">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const followedGameIds = new Set(followedGames.map((game) => game.id));

  const gamesToDisplay = selectedOption === "all" ? allGames : followedGames;

  const filteredGames = gamesToDisplay.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Tabs */}
      <div className="text-center mb-6">
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => setSelectedOption("all")}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
              selectedOption === "all"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setSelectedOption("followed")}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
              selectedOption === "followed"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Followed Games
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Render Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            <Link href={`/games/${game.id}`}>
              <div className="relative w-full h-48 cursor-pointer">
                <Image
                  src={game.img || "/img_insert.png"}
                  alt={game.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
            </Link>
            <div className="p-4 flex items-center justify-evenly">
              <div className="text-xl font-semibold text-gray-800 truncate cursor-pointer">
                <Link href={`/games/${game.id}`}>{game.name}</Link>
              </div>
              <div>
                <FollowButton
                  gameId={game.id}
                  isFollowed={followedGameIds.has(game.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesWrapper;
