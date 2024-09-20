'use client'

import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import AnimatedLogoCloud from "@/app/components/Landing/AnimatedLogoCloud";
import LandingNavBar from "@/app/components/Landing/LandingNavBar";
import ProductSection from "@/app/components/Landing/ProductSection";
import FeatureSection from "@/app/components/Landing/FeatureSection";
import HeroSection from "@/app/components/Landing/HeroSection";
import IntegrationSection from "@/app/components/Landing/IntegrationSection";
import SecuritySection from "@/app/components/Landing/SecuritySection";
import PricingSection from "@/app/components/Landing/PricingSection";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <LandingNavBar/>
      <main className="text-gray-800">
        <SectionContainer>
          <HeroSection/>
          <AnimatedLogoCloud/>
          <ProductSection/>
          <FeatureSection/>
        </SectionContainer>
        <div className="bg-gray-100">
          <SectionContainer className="py-16 space-y-8">
            <IntegrationSection/>
            <SecuritySection/>
          </SectionContainer>
        </div>
        <SectionContainer className="py-16">
          <PricingSection/>
        </SectionContainer>
        <div className="bg-black py-16">
          <SectionContainer>
            <p className="font-bold text-gray-100 text-4xl text-center max-w-[830px] mx-auto sm:text-5xl">
              The <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-secondary-700">future</span> of
              business intelligence is here.
            </p>
            <div className="flex justify-center mt-8">
              <Button
                className="max-w-sm text-white text-lg rounded-xl bg-primary-700 shadow-none py-5 px-12 hover:bg-primary-600"
                asChild
              >
                <Link href="/signup">
                  Join now
                </Link>
              </Button>
            </div>
          </SectionContainer>
        </div>
      </main>
      <footer className="py-8 bg-gray-100">
        <SectionContainer className="flex gap-12 justify-between items-center">
          <div className="">
            <div className="flex items-center gap-2 text-3xl text-primary-500 font-extrabold">
              <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-10 w-8" width="28"
                     height="28"/>
              GoodBI
              <span className="sr-only">GoodBI</span>
            </div>
            <span className="block text-gray-500 text-sm mt-4">
            &copy; {new Date().getFullYear()} GoodBI. All Rights Reserved.
          </span>
          </div>
          <nav className="justify-end flex flex-wrap gap-y-3 gap-x-7 text-gray-600 flex-col sm:flex-row">
            <Link className="transition-colors duration-100 hover:text-primary-700" href="/#product">
              Product
            </Link>
            <Link className="transition-colors duration-100 hover:text-primary-700" href="/#features">
              Features
            </Link>
            <Link className="transition-colors duration-100 hover:text-primary-700" href="/#integration">
              Integration
            </Link>
            <Link className="transition-colors duration-100 hover:text-primary-700" href="/#security">
              Security
            </Link>
            <Link className="transition-colors duration-100 hover:text-primary-700" href="/#pricing">
              Pricing
            </Link>
          </nav>
        </SectionContainer>
      </footer>
    </>
  );
}

const SectionContainer = ({className, children}: { className?: string, children: ReactNode }) => {
  return (
    <div className={cn("px-4 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  )
}