import { getAllGames } from "@/lib/actions";
import { getFollowedGames } from "@/lib/actions";
import GamesWrapper from "./GameList";

const GamesPage = async () => {
  const allGames = await getAllGames();
  const followedGames = await getFollowedGames();

  return (
    <div className="py-8">
      <GamesWrapper allGames={allGames} followedGames={followedGames} />
    </div>
  );
};

export default GamesPage;
