"use client";

import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="navbar-bg h-[102px] flex items-center justify-center px-4 md:px-8 lg:px-16 xl:px-32">
      <div className="hidden lg:block w-[25%]">
        <Link href="/" className="font-bold text-3xl text-red-600">
          <Image src="/SQUADZ.png" alt="logo" width={180} height={48} />
        </Link>
      </div>
      <div className="hidden md:flex w-[50%] text-md font-bold items-center justify-center gap-12">
        {/* LINKS */}
        <div className="flex gap-6">
          <Link href="/games">
            <span>Games</span>
          </Link>
        </div>
        <div className="flex gap-6">
          <Link href="/squadz">
            <span>My Squadz</span>
          </Link>
        </div>
        <div className="flex gap-6">
          {user && (
            <Link href={`/profile/${user.username}`}>
              <span>Profile</span>
            </Link>
          )}
        </div>
      </div>
      <div className="w-[25%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <Link href="/">
              <span className="text-xl font-medium text-red-500">
                {user?.username}
              </span>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-6 text-sm font-bold">
              <Link href="/sign-in">Login</Link>
              <Link href="/sign-up">
                <button className="bg-red-500 text-white text-sm px-6 py-3 rounded-md">
                  Sign Up
                </button>
              </Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
