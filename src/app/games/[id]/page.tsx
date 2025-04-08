import prisma from "@/lib/client";
import Image from "next/image";
import GamePosts from "../../components/GamePosts";

const GamePage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = Number(params.id);

  // Fetch game details
  const game = await prisma.games.findUnique({
    where: { id },
  });

  if (!game) {
    return <div className="text-center py-8">Game not found</div>;
  }

  const posts = await prisma.post.findMany({
    where: { gameId: id },
    include: {
      user: { select: { username: true } },
      gameMode: { select: { name: true } },
      users: {
        select: {
          userId: true,
        },
      },
      PendingApplication: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const gameModes = await prisma.gameModes.findMany({
    where: { gameId: id },
  });

  const platforms = ["Any", "PC", "PS5", "XBOX", "Switch"];
  const regions = [
    "Global",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Australia",
  ];

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="relative w-full h-[50vh] bg-black flex items-center">
        <Image
          src={game.img || "/img_insert.png"}
          alt={game.name}
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        />
        <div className="absolute left-8 md:left-16 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4">
            {game.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-lg">
            {game.desc || "No description available."}
          </p>
        </div>
      </div>

      <div className="mx-auto py-6">
        <h2 className="text-2xl font-semibold red-text mb-4">Filter Posts</h2>
        <GamePosts
          posts={posts}
          gameModes={gameModes}
          platforms={platforms}
          regions={regions}
          gameData={{ name: game.name, img: game.img || "/img_insert.png" }}
        />
      </div>
    </div>
  );
};

export default GamePage;
