"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/usercontrol";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll";

export const Navbar = () => {
  const { showNavbar, scrolledUp } = useScrollDirection(50);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ",

        showNavbar ? "top-2 opacity-100 " : "-top-20 opacity-0",
        scrolledUp ? "backdrop-blur-md  bg-black/40 " : ""
      )}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center p-4">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src="/globe.svg" alt="Vibe" width={24} height={24} />
          <span className="font-semibold text-lg">Vibe</span>
        </Link>

        <SignedOut>
          <div className="flex gap-2 ">
            <SignUpButton>
              <Button variant={"outline"} size={"sm"}>
                Sign up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size={"sm"}>Sign in</Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  );
};
