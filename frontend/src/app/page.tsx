'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedLogoCloud from "@/app/components/Landing/AnimatedLogoCloud";
import Meteors from "@/app/components/Landing/Meteors";
import RetroGrid from "@/app/components/Landing/RetroGrid";
import Globe from "@/app/components/Landing/Globe";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {useState} from "react";
import {LucideSparkles, LucideChartArea, LucidePencilRuler} from "lucide-react";
import {AiFeature} from "@/app/components/Landing/AiFeature";
import {ChartFeature} from "@/app/components/Landing/ChartFeature";
import CustomisableFeature from "@/app/components/Landing/CustomisableFeature";
import {IntegrationIconCloud} from "@/app/components/Landing/IntegrationIconCloud";
import LandingNavBar from "@/app/components/Landing/LandingNavBar";
import ProductSection from "@/app/components/Landing/ProductSection";

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
          <div className="py-32 px-4 md:px-16">
            <span className="text-primary-500" id="features">Features</span>
            <h2 className="text-4xl mt-2 max-w-xl sm:text-5xl">
              <span className="font-bold">Get better insights, faster.</span>
              <br/>
              Powerful analytics on metrics that matter.
            </h2>
            <FeatureSection/>
          </div>
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

const FeatureSection = () => {
  const [value, setValue] = useState('item-1')

  const handleValueChange = (newValue: string) => {
    if (!newValue) {
      return;
    }

    setValue(newValue);
  }

  return (
    <div className="flex h-full mt-12 items-center gap-12 md:mt-0 md:h-[600px]">
      <Accordion className="w-full md:w-2/5" type="single" collapsible value={value} onValueChange={handleValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <LucideSparkles className="h-5 w-5"/> AI-powered
          </span>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Instantly generate key insights from your data, using the latest large-language models from OpenAI.
            <AiFeature className="block h-[368px] md:hidden md:h-[500px]"/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <LucideChartArea className="h-5 w-5"/> Data visualisations
          </span>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Get real-time data visualisations from the click of a button.
            <div className="block pt-6 md:hidden md:pt-0">
              <ChartFeature/>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <LucidePencilRuler className="h-5 w-5"/> Fully customisable
          </span>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Place your insights where you want them to be. Resize and move them freely on your dashboard.
            <div className="block pt-6 md:hidden md:pt-0">
              <CustomisableFeature/>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex-grow hidden md:block">
        {value === 'item-1' && <AiFeature/>}
        {value === 'item-2' && <ChartFeature/>}
        {value === 'item-3' && <CustomisableFeature/>}
      </div>
    </div>
  )
}