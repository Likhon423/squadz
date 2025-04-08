import Image from "next/image";
import Link from "next/link";
import React from "react";

const Post = () => {
  return (
    <div className="navbar-bg flex p-6 rounded-lg">
      <div className="">
        <Image
          src="/games/new-world.jpg"
          width={220}
          height={180}
          alt="game"
          className="rounded-md hidden md:block"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4">
        <div className="flex flex-col justify-between">
          <div className="text-lg font-medium">
            Barnacles and Black powder mutation 10 looking for all roles
          </div>
        </div>
        <div className="text-sm text-[#D9D9D9]">experienced players only</div>
        <div className="flex gap-2 items-center text-sm">
          <div className="bg-[#24272d] px-2 rounded-md">Asia</div>
          <div className="bg-[#24272d] px-2 rounded-md">Expedition</div>
          <div className="bg-[#24272d] px-3 rounded-md">Mutation</div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="flex gap-4 items-center justify-between">
          <Image src="/icons/time.png" alt="" width={20} height={20} />
          <Image src="/icons/link.png" alt="" width={20} height={20} />
          <Image src="/icons/7s.png" alt="" width={20} height={20} />
        </div>
        <div className="flex items-center gap-6 font-bold justify-end">
          <Link href="/">
            <button className="bg-white text-black text-xl px-6 py-4 rounded-xl">
              Join Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
