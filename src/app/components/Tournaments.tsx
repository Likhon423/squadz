import React from "react";
import Tournament from "./Tournament";

const Tournaments = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="red-text text-2xl pt-4 font-medium">Join Tournaments</div>
      <Tournament />
      <Tournament />
      <Tournament />
      <Tournament />
      <Tournament />
      <Tournament />
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-red-500"></div>
        <span className="px-4 red-text font-medium">See All ↗</span>
        <div className="flex-grow border-t border-red-500"></div>
      </div>
    </div>
  );
};

export default Tournaments;
