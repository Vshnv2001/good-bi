"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";

const LandingNavBar = () => {
  const { scrollY } = useScroll()
  const ref = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!ref || !ref.current) {
      return;
    }

    if (latest > 0) {
      ref.current.classList.add('shadow-sm')
    } else {
      ref.current.classList.remove('shadow-sm')
    }
  })

  return (
    <header ref={ref} className="sticky top-0 bg-background z-20">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl text-primary-500 font-logo font-extrabold"
        >
          <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-8 w-6" width="28" height="28"/>
          GoodBI
          <span className="sr-only">GoodBI</span>
        </Link>
        <div className="flex gap-2 items-center">
          <Button
            className="text-gray-800"
            variant="ghost"
            asChild
          >
            <Link href="/login">
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default LandingNavBar