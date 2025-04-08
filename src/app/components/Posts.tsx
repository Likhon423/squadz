import Image from "next/image";
import React from "react";
import Post from "./Post";

const Posts = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="red-text text-2xl pt-4 font-medium">Squads For You</div>
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-red-500"></div>
        <span className="px-4 red-text font-medium">See All ↗</span>
        <div className="flex-grow border-t border-red-500"></div>
      </div>
    </div>
  );
};

export default Posts;
