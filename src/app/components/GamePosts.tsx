"use client";

import { useState } from "react";
import Filters from "../games/[id]/Filters";
import GamePost from "./GamePost";
import { addUserToPending, addUserToPost } from "@/lib/actions";

const GamePosts = ({
  posts,
  gameData,
  gameModes,
  platforms,
  regions,
}: {
  posts: any[];
  gameData: { name: string; img: string };
  gameModes: { name: string }[];
  platforms: string[];
  regions: string[];
}) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleFilterChange = (filters: {
    postType: string;
    region: string;
    gameMode: string;
    platform: string;
  }) => {
    let updatedPosts = posts;

    if (filters.postType) {
      updatedPosts = updatedPosts.filter(
        (post) => post.type === filters.postType
      );
    }
    if (filters.region) {
      updatedPosts = updatedPosts.filter(
        (post) => post.region === filters.region
      );
    }
    if (filters.gameMode) {
      updatedPosts = updatedPosts.filter(
        (post) => post.gameMode.name === filters.gameMode
      );
    }
    if (filters.platform) {
      updatedPosts = updatedPosts.filter(
        (post) => post.platform === filters.platform
      );
    }

    setFilteredPosts(updatedPosts);
  };

  const handleJoin = async (post: any) => {
    try {
      if (post.privacy === "PUBLIC") {
        const response = await addUserToPost(post.id);
        if (response.success) {
          alert(response.message);
        } else {
          alert(response.message || "Failed to join the squad.");
        }
      } else if (post.privacy === "PRIVATE") {
        const response = await addUserToPending(post.id);
        if (response.success) {
          alert(response.message);
        } else {
          alert(response.message || "Failed to apply to the squad.");
        }
      } else if (post.privacy === "PROTECTED") {
        const password = prompt("Enter the password to join this post:");
        if (!password) {
          alert("Password is required to join this post.");
          return;
        }

        const response = await addUserToPost(post.id, password);
        if (response.success) {
          alert(response.message);
        } else {
          alert(response.message || "Failed to join the squad.");
        }
      }
    } catch (error) {
      console.error("Error during join:", error);
      alert("Failed to complete the action. Please try again.");
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <Filters
        platforms={platforms}
        regions={regions}
        gameModes={gameModes}
        onFilterChange={handleFilterChange}
      />
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center text-gray-500">
            No posts available for this game.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <GamePost
              key={post.id}
              post={post}
              gameData={gameData}
              handleJoin={handleJoin}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GamePosts;
