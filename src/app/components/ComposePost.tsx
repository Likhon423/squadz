"use client";

import { useEffect, useState } from "react";
import { getGamesWithModes, createPost } from "@/lib/actions";

const ComposePost = () => {
  const [games, setGames] = useState<
    { id: number; name: string; gameModes: { id: number; name: string }[] }[]
  >([]);
  const [gameModes, setGameModes] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<number | null>(null);
  const [region, setRegion] = useState("Global");
  const [platform, setPlatform] = useState("Any");
  const [postType, setPostType] = useState("Squad");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await getGamesWithModes();
      setGames(fetchedGames);
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame && games.length > 0) {
      const selected = games.find((game) => game.id === selectedGame);
      setGameModes(selected?.gameModes || []);
    } else {
      setGameModes([]);
    }
  }, [selectedGame, games]);

  const handleSubmit = async () => {
    if (!selectedGame || !selectedGameMode || !description) {
      alert("Please fill out all required fields.");
      return;
    }

    if (privacy === "PROTECTED" && !password) {
      alert("Please enter a password for the protected post.");
      return;
    }

    const postData = {
      gameId: selectedGame,
      gameModeId: selectedGameMode,
      region,
      platform,
      type: postType,
      description,
      privacy,
      password: privacy === "PROTECTED" ? password : undefined,
    };

    try {
      const createdPost = await createPost(postData);
      console.log("Post created:", createdPost);
      alert("Post created successfully!");
      // Reset the form
      setSelectedGame(null);
      setSelectedGameMode(null);
      setRegion("Global");
      setPlatform("Any");
      setPostType("Squad");
      setDescription("");
      setPrivacy("PUBLIC");
      setPassword("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="w-full compose-bg text-white p-6 rounded-lg shadow-md">
      {/* Row 1: Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium red-text">Create Post</h2>
      </div>

      {/* Row 2: Selectable Options */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        {/* Post Type Selection */}
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          className="w-full p-2 rounded navbar-bg text-white"
        >
          <option value="Squad">Squad</option>
          <option value="Tournament">Tournament</option>
        </select>

        {/* Game Selection */}
        <select
          value={selectedGame || ""}
          onChange={(e) => setSelectedGame(Number(e.target.value))}
          className="w-full p-2 rounded navbar-bg text-white"
        >
          <option value="" disabled>
            Select a game
          </option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>

        {/* Game Mode Selection */}
        <select
          value={selectedGameMode || ""}
          onChange={(e) => setSelectedGameMode(Number(e.target.value))}
          className="w-full p-2 rounded navbar-bg text-white"
          disabled={!selectedGame}
        >
          <option value="" disabled>
            Select a game mode
          </option>
          {gameModes.map((mode) => (
            <option key={mode.id} value={mode.id}>
              {mode.name}
            </option>
          ))}
        </select>

        {/* Region Selection */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full p-2 rounded navbar-bg text-white"
        >
          <option value="Global">Global</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Africa">Africa</option>
          <option value="Australia">Australia</option>
        </select>

        {/* Platform Selection */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-2 rounded navbar-bg text-white"
        >
          <option value="Any">Any</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Switch">Switch</option>
          <option value="Mobile">Mobile</option>
        </select>

        {/* Privacy Selection */}
        <div className="mb-4">
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full p-2 rounded navbar-bg text-white"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="PROTECTED">Protected</option>
          </select>
        </div>

        {/* Password Input for Protected Privacy */}
        {privacy === "PROTECTED" && (
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded navbar-bg text-white"
              placeholder="Enter password for this post..."
            />
          </div>
        )}
      </div>

      {/* Row 3: Description Box */}
      <div className="mb-6">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded navbar-bg text-white"
          placeholder="Enter a description for your post..."
          style={{ height: "80px" }}
          maxLength={1000}
        />
      </div>

      {/* Row 4: Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded font-semibold"
        >
          Create Post
        </button>
      </div>
    </div>
  );
};

export default ComposePost;
