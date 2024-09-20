'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedLogoCloud from "@/app/components/Landing/AnimatedLogoCloud";
import {IntegrationIconCloud} from "@/app/components/Landing/IntegrationIconCloud";
import LandingNavBar from "@/app/components/Landing/LandingNavBar";
import ProductSection from "@/app/components/Landing/ProductSection";
import FeatureSection from "@/app/components/Landing/FeatureSection";

export default function Home() {
  return (
    <>
      <LandingNavBar />
      <main className="text-gray-800">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="bg-primary-50 h-[calc(100lvh-60px)] rounded-2xl py-16">
            <div className="mx-auto text-center px-4 w-full max-w-2xl">
              <h1 className="font-bold text-5xl sm:text-6xl">
                Say <span className="text-primary-500">goodbye</span> to complex analytics.
              </h1>
              <p className="text-gray-700 leading-6 text-lg md:text-xl pt-3">
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
          <ProductSection />
          <FeatureSection />
        </div>
        <div className="bg-gray-100">
          <div className="px-4 py-16 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl py-12">
              <div className="mx-auto max-w-5xl px-4 flex items-center justify-between gap-8 flex-col md:flex-row">
                <div className="max-w-md">
                  <span className="text-primary-500" id="integration">Integration</span>
                  <h2 className="text-4xl mt-2 sm:text-5xl">
                    <span className="font-bold">All your needs, in one platform.</span>
                  </h2>
                  <p className="mt-6">
                    Seamless integrations with your favourite business applications, from CRM tools to cloud storage.
                  </p>
                </div>
                <IntegrationIconCloud/>
              </div>
            </div>
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
          </div>
        </div>
      </main>
    </>
  );
}
