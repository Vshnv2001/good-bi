"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import HeroTabs from "@/app/components/Landing/HeroTabs";


const HeroSection = () => {
  return (
    <section className="bg-primary-50 overflow-hidden h-[calc(100lvh-60px)] min-h-[500px] rounded-2xl py-20">
      <div className="mx-auto text-center px-4 w-full max-w-2xl">
        <h1 className="font-bold text-5xl sm:text-6xl">
          Say <span className="text-primary-500">goodbye</span> to complex analytics.
        </h1>
        <p className="text-gray-700 leading-6 text-lg md:text-xl pt-4">
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
      <HeroTabs />
    </section>
  )
}

export default HeroSection
