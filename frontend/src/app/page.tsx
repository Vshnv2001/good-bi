'use client'

import AnimatedLogoCloud from "@/app/components/Landing/AnimatedLogoCloud";
import LandingNavBar from "@/app/components/Landing/LandingNavBar";
import ProductSection from "@/app/components/Landing/ProductSection";
import FeatureSection from "@/app/components/Landing/FeatureSection";
import HeroSection from "@/app/components/Landing/HeroSection";
import IntegrationSection from "@/app/components/Landing/IntegrationSection";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";

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
          <SectionContainer className="py-16">
            <IntegrationSection />
            <div className="bg-white rounded-2xl py-16 mt-8">
              <div className="mx-auto max-w-5xl px-4">
                <div className="max-w-lg">
                  <span className="text-primary-500" id="security">Security</span>
                  <h2 className="text-4xl mt-2 sm:text-5xl">
                    <span className="font-bold">You can count on us.</span> Reliable and secure by design.
                  </h2>
                </div>
                <div
                  className="mt-12 text-gray-600 flex flex-wrap justify-center lg:justify-between gap-x-8 gap-y-8 font-bold leading-5">
                  <div className="w-36">
                    Built with
                    <div
                      className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
                    >
                      SOC 2
                    </div>
                    compliance in mind.
                  </div>
                  <div className="w-36">
                    World-class
                    <div
                      className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
                    >
                      99.9%
                    </div>
                    operational uptime.
                  </div>
                  <div className="w-36">
                    Industry standard
                    <div
                      className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
                    >
                      AES-256
                    </div>
                    data encryption standards.
                  </div>
                  <div className="w-36">
                    Deployed on
                    <div
                      className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
                    >
                      100+
                    </div>
                    edge locations globally.
                  </div>
                  <div className="w-36">
                    Up to
                    <div
                      className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
                    >
                      24/7
                    </div>
                    customer service support.
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>
        </div>
      </main>
    </>
  );
}

const SectionContainer = ({ className, children }: { className?: string, children: ReactNode }) => {
  return (
    <div className={cn("px-4 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  )
}