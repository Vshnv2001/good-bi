'use client'

import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import AnimatedLogoCloud from "@/app/components/Landing/AnimatedLogoCloud";
import Meteors from "@/app/components/Landing/Meteors";
import RetroGrid from "@/app/components/Landing/RetroGrid";
import Globe from "@/app/components/Landing/Globe";

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
              <Button
                className="text-white text-lg rounded-xl bg-primary-700 shadow-none p-5 hover:bg-primary-600 mt-6"
                asChild
              >
                <Link href="/signup">
                  Try it free!
                </Link>
              </Button>
            </div>
          </div>
          <AnimatedLogoCloud/>
          <div className="bg-gray-100 rounded-2xl py-32">
            <div className="mx-auto text-center px-4 w-full max-w-2xl">
              <span className="text-primary-500" id="product">Product</span>
              <h2 className="font-bold text-4xl mt-2 sm:text-5xl">
                The ultimate <span className="text-primary-500">AI business intelligence</span> tool.
              </h2>
            </div>
            <div className="grid grid-cols-1 max-w-5xl mx-auto gap-4 mt-6 px-8 md:grid-cols-3">
              <div className="relative overflow-hidden bg-white rounded-xl h-[216px]">
                <Meteors number={200}/>
                <div className="flex flex-col h-full justify-end p-5">
                  <h3 className="text-lg font-bold">Effortless insights</h3>
                  <p className="leading-5 text-gray-500">No knowledge in business intelligence required.</p>
                </div>
              </div>
              <div className="relative overflow-hidden bg-white rounded-xl h-[216px]">
                <Globe className="relative h-48 w-48 mb-6"/>
                <div className="absolute bottom-0 p-5 z-10">
                  <h3 className="text-lg font-bold">Works anywhere</h3>
                  <p className="leading-5 text-gray-500">On any device, from mobile phones to desktops.</p>
                </div>
              </div>
              <div className="relative overflow-hidden bg-white rounded-xl h-[216px]">
                <RetroGrid className=""/>
                <div className="flex flex-col h-full justify-end p-5 relative">
                  <h3 className="text-lg font-bold">Designed for speed</h3>
                  <p className="leading-5 text-gray-500">Generate key performance indicators in just minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
