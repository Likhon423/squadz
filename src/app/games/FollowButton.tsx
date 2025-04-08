"use client";

import { switchFollow } from "@/lib/actions";
import { useOptimistic, useState, useTransition } from "react";

const FollowButton = ({
  gameId,
  isFollowed,
}: {
  gameId: number;
  isFollowed: boolean;
}) => {
  const [isFollowing, setFollowing] = useState(isFollowed);
  const [optimisticFollow, optimisticSwitchFollow] = useOptimistic(
    isFollowing,
    () => !isFollowing
  );

  const [isPending, startTransition] = useTransition();

  const followAction = async (gameId: number, isFollowing: boolean) => {
    startTransition(() => {
      optimisticSwitchFollow(isFollowing);
      try {
        switchFollow(gameId);
        setFollowing(!isFollowing);
      } catch (err) {}
    });
  };

  return (
    <button
      onClick={() => followAction(gameId, isFollowing)}
      className={`${
        optimisticFollow ? "bg-red-500" : "bg-gray-500"
      } text-white rounded-md px-4 py-2 mt-2`}
    >
      {optimisticFollow ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
