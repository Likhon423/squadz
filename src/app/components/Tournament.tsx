import Image from "next/image";
import Link from "next/link";
import React from "react";

const Tournament = () => {
  return (
    <div className="navbar-bg flex p-6 rounded-lg">
      <div className="">
        <Image
          src="/games/pubg.jpg"
          width={220}
          height={180}
          alt="game"
          className="rounded-md hidden md:block"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4">
        <div className="flex flex-col justify-between">
          <div className="text-lg font-medium">PUBG Master Cup SEA 2024</div>
        </div>
        <div className="text-sm text-[#D9D9D9]">
          Squad vs Squad online tournament for a total prize money of 100,000
          dollars
        </div>
        <div className="flex gap-2 items-center text-sm">
          <div className="bg-[#24272d] px-2 rounded-md">Sqauds</div>
          <div className="bg-[#24272d] px-2 rounded-md">SEA</div>
          <div className="bg-[#24272d] px-3 rounded-md">Master Cup</div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <div className="flex items-center gap-6 font-bold justify-end">
          <Link href="/">
            <button className="bg-white text-black text-xl p-8 rounded-xl">
              Apply
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tournament;
