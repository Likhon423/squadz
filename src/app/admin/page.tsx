import React from "react";
import AddGame from "./AddGame";
import AddGameMode from "./AddGameMode";

const AdminPage = () => {
  return (
    <div className="min-h-screen py-12 px-6 flex flex-col items-center">
      <div className="max-w-screen-xl w-full space-y-12">
        <h1 className="text-4xl font-semibold text-center red-text mb-8">
          Admin Dashboard
        </h1>

        <div className="flex flex-col gap-12 justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <AddGame />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <AddGameMode />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
