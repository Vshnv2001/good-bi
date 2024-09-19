'use client'

import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl text-primary-500 font-extrabold"
        >
          <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-8 w-6" width="28" height="28"/>
          GoodBI
          <span className="sr-only">GoodBI</span>
        </Link>
        <div className="flex gap-2 items-center">
          <Button
            className="text-base rounded-xl text-gray-800 shadow-none"
            variant="ghost"
            asChild
          >
            <Link href="/login">
              Login
            </Link>
          </Button>
          <Button
            className="text-base text-white rounded-xl bg-primary-700 shadow-none px-4 py-2.5 hover:bg-primary-600"
            asChild
          >
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </nav>
      <main className="text-gray-800">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="bg-primary-50 h-[calc(100lvh-60px)] rounded-2xl py-16">
            <div className="mx-auto text-center px-4 w-full max-w-2xl">
              <h1 className="font-bold text-5xl sm:text-6xl">
                Say <span className="text-primary-500">goodbye</span> to complex analytics.
              </h1>
              <p className="text-gray-700 text-xl pt-3">
                GoodBI takes away the complexity of business intelligence with the power of AI. Trusted by many
                high-growth startups.
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                className="text-white text-lg rounded-xl bg-primary-700 shadow-none p-5 hover:bg-primary-600"
                asChild
              >
                <Link href="/signup">
                  Try it free!
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
