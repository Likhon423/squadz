"use client";

import { useUser } from "@clerk/nextjs";

interface GamePostProps {
  post: any;
  gameData: { name: string; img: string };
  handleJoin: (post: any) => Promise<void>;
}

const GamePost = ({ post, gameData, handleJoin }: GamePostProps) => {
  const { user } = useUser();

  return (
    <div
      key={post.id}
      className="flex flex-col md:flex-row items-center bg-gray-900 rounded-lg p-4 shadow-md gap-2"
    >
      {/* Left Section: Game Image and Name */}
      <div className="w-1/5 flex flex-col items-center navbar-bg rounded">
        <img
          src={gameData.img}
          alt={gameData.name}
          className="w-32 h-20 object-cover rounded-md mt-2"
        />
        <span className="mt-2 text-white font-medium text-center">
          {gameData.name}
        </span>
      </div>

      {/* Middle Section: Post Details */}
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold text-white">
          {post.type} - {post.gameMode.name}
        </h3>
        <p className="text-gray-400 mt-1 truncate">{post.desc}</p>
        <p className="text-sm text-gray-300 mt-2">
          <span className="font-medium text-white">Created by:</span>{" "}
          {post.user.username}
        </p>
        <div className="flex mt-2 space-x-2 text-sm">
          <span className="bg-gray-700 px-3 py-1 rounded text-gray-300">
            {post.platform}
          </span>
          <span className="bg-gray-700 px-3 py-1 rounded text-gray-300">
            {post.region}
          </span>
          <span className="bg-gray-700 px-3 py-1 rounded text-gray-300">
            {post.privacy}
          </span>
        </div>
      </div>

      {/* Right Section: Action Button */}
      {post.users.some(
        (userOnPost: { userId: string | undefined }) =>
          userOnPost.userId === user?.id
      ) ||
      post.PendingApplication.some(
        (pending: { userId: string | undefined }) => pending.userId === user?.id
      ) ? (
        <button className="bg-gray-600 text-white px-6 py-5 rounded text-lg font-medium cursor-not-allowed">
          {post.users.some(
            (userOnPost: { userId: string | undefined }) =>
              userOnPost.userId === user?.id
          )
            ? "Already joined"
            : "Pending approval"}
        </button>
      ) : (
        <div className="flex-shrink-0">
          <button
            onClick={() => handleJoin(post)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-5 rounded text-lg font-medium"
          >
            {post.privacy === "PUBLIC"
              ? "Join"
              : post.privacy === "PRIVATE"
              ? "Apply"
              : "Enter Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePost;
