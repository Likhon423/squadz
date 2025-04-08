"use client";

import { useEffect, useState } from "react";
import { getFollowedGames } from "@/lib/actions";
import Link from "next/link";

const YourGames = () => {
  const [followedGames, setFollowedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedGames = async () => {
      try {
        const games = await getFollowedGames();
        setFollowedGames(games);
      } catch (error) {
        console.error("Error fetching followed games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedGames();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="red-text text-2xl pt-4 font-medium">Your Games</div>

      {followedGames.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't followed any games. Follow some games to see them here.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {followedGames.map((game: any) => (
            <Link href={`/games/${game.id}`} key={game.id}>
              {" "}
              {/* Added key here */}
              <div className="flex flex-col gap-3">
                <div className="w-full h-60">
                  <img
                    src={game.img}
                    alt={game.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <span className="font-medium text-lg">{game.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-red-500"></div>
        <Link href="/games">
          <span className="px-4 red-text font-medium">See All ↗</span>
        </Link>
        <div className="flex-grow border-t border-red-500"></div>
      </div>
    </div>
  );
};

export default YourGames;
