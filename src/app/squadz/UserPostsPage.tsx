"use client";

import { useEffect, useState } from "react";
import {
  addUserToPending,
  addUserToPost,
  cancelPendingRequest,
  deletePost,
  getUserPosts,
} from "@/lib/actions";
import GamePost from "../components/GamePost";
import Link from "next/link";

const UserPostsPage = () => {
  const [postsData, setPostsData] = useState<{
    createdPosts: any[];
    joinedPosts: any[];
    pendingPosts: any[];
  }>({ createdPosts: [], joinedPosts: [], pendingPosts: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts();
        setPostsData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handleCancelRequest = async (postId: number) => {
    try {
      const response = await cancelPendingRequest(postId);
      if (response.success) {
        alert(response.message);
        setPostsData((prev) => ({
          ...prev,
          pendingPosts: prev.pendingPosts.filter((post) => post.id !== postId),
        }));
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      alert("Failed to cancel the request.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await deletePost(postId);
      if (response.success) {
        alert(response.message);
        setPostsData((prev) => ({
          ...prev,
          createdPosts: prev.createdPosts.filter((post) => post.id !== postId),
        }));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const { createdPosts, joinedPosts, pendingPosts } = postsData;

  return (
    <div className="space-y-8">
      {/* Pending Posts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold red-text mb-4">
          Pending Applications
        </h2>
        {pendingPosts.length === 0 ? (
          <div className="text-gray-500" key="no-pending">
            No pending applications.
          </div>
        ) : (
          pendingPosts.map((post) => (
            <div key={`pending-${post.id}`} className="flex flex-col gap-2">
              <GamePost
                post={post}
                gameData={{ name: post.game.name, img: post.game.img }}
                handleJoin={handleJoin}
              />
              <button
                onClick={() => handleCancelRequest(post.id)}
                className="px-4 py-2 bg-red-500 text-white rounded self-end mr-6"
              >
                Cancel Request
              </button>
            </div>
          ))
        )}
      </section>

      {/* Joined Posts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold red-text mb-4">Joined Squadz</h2>
        {joinedPosts.length === 0 ? (
          <div className="text-gray-500">You haven't joined any posts yet.</div>
        ) : (
          joinedPosts.map((post) => (
            <div key={`joined-${post.id}`}>
              <Link href={`/squadz/${post.id}`}>
                <GamePost
                  post={post}
                  gameData={{ name: post.game.name, img: post.game.img }}
                  handleJoin={handleJoin}
                />
              </Link>
            </div>
          ))
        )}
      </section>

      {/* Created Posts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold red-text mb-4">Created Squadz</h2>
        {createdPosts.length === 0 ? (
          <div className="text-gray-500">
            You haven't created any posts yet.
          </div>
        ) : (
          createdPosts.map((post) => (
            <div
              key={`created-${post.id}`}
              className="flex flex-col gap-2 navbar-bg"
            >
              <GamePost
                post={post}
                gameData={{ name: post.game.name, img: post.game.img }}
                handleJoin={handleJoin}
              />
              <button
                onClick={() => handleDeletePost(post.id)}
                className="px-4 py-2 bg-red-500 text-white rounded self-end mr-6"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default UserPostsPage;
