'use client'

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import AnimatedLogoCloud from "@/app/components/Landing/AnimatedLogoCloud";
import LandingNavBar from "@/app/components/Landing/LandingNavBar";
import ProductSection from "@/app/components/Landing/ProductSection";
import FeatureSection from "@/app/components/Landing/FeatureSection";
import HeroSection from "@/app/components/Landing/HeroSection";
import IntegrationSection from "@/app/components/Landing/IntegrationSection";
import SecuritySection from "@/app/components/Landing/SecuritySection";
import PricingSection from "@/app/components/Landing/PricingSection";

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
            <IntegrationSection />
            <SecuritySection />
          </SectionContainer>
        </div>
        <SectionContainer className="py-16">
          {/*<div className="mx-auto text-center px-4 w-full max-w-2xl">*/}
          {/*  <span className="text-primary-500" id="pricing">Pricing</span>*/}
          {/*  <h2 className="font-bold text-4xl mt-2 sm:text-5xl">*/}
          {/*    Choose the right plan.*/}
          {/*  </h2>*/}
          {/*</div>*/}
          <PricingSection />
        </SectionContainer>
      </main>
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