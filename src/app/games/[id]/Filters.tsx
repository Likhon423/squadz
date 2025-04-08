"use client";

import { useState, useEffect } from "react";

interface FiltersProps {
  platforms: string[];
  regions: string[];
  gameModes: { name: string }[];
  onFilterChange: (filters: {
    postType: string;
    region: string;
    gameMode: string;
    platform: string;
  }) => void;
}

const Filters = ({
  platforms,
  regions,
  gameModes,
  onFilterChange,
}: FiltersProps) => {
  const [filters, setFilters] = useState({
    postType: "",
    region: "",
    gameMode: "",
    platform: "",
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Post Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Post Type
        </label>
        <select
          value={filters.postType}
          onChange={(e) => setFilters({ ...filters, postType: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
        >
          <option value="">Select Post Type</option>
          <option value="Squad">Squad</option>
          <option value="Tournament">Tournament</option>
        </select>
      </div>

      {/* Region Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Region
        </label>
        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Game Mode Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Game Mode
        </label>
        <select
          value={filters.gameMode}
          onChange={(e) => setFilters({ ...filters, gameMode: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
        >
          <option value="">Select Game Mode</option>
          {gameModes.map((mode) => (
            <option key={mode.name} value={mode.name}>
              {mode.name}
            </option>
          ))}
        </select>
      </div>

      {/* Platform Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Platform
        </label>
        <select
          value={filters.platform}
          onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
        >
          <option value="">Select Platform</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
