'use client'

import {ReactNode, useEffect} from "react";
import {cn, doesSessionExist} from "@/lib/utils";
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
import Particles from "@/app/components/Landing/Particles";
import LandingFooter from "@/app/components/Landing/LandingFooter";
import FAQSection from "@/app/components/Landing/FAQSection";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    doesSessionExist().then((hasSession) => {
      if (hasSession) {
        router.replace("/dashboard");
      }
    })
  }, [router]);

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
        <SectionContainer className="py-16 space-y-24">
          <PricingSection/>
          <FAQSection/>
        </SectionContainer>
        <div className="relative bg-black py-16">
          <Particles
            className="absolute inset-0 pointer-events-none"
            ease={80}
            color={"#ffffff"}
            refresh
          />
          <SectionContainer className="z-50">
            <p className="font-bold text-gray-100 text-4xl text-center max-w-[830px] mx-auto sm:text-5xl">
              The <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-secondary-700">future</span> of
              business intelligence is here.
            </p>
            <div className="flex justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/signup">
                  Join now
                </Link>
              </Button>
            </div>
          </SectionContainer>
        </div>
      </main>
      <LandingFooter/>
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