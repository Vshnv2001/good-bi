"use client"

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LucideChartArea, LucidePencilRuler, LucideSparkles } from "lucide-react";
import { AiFeature } from "@/app/components/Landing/AiFeature";
import { ChartFeature } from "@/app/components/Landing/ChartFeature";
import CustomisableFeature from "@/app/components/Landing/CustomisableFeature";

const FeatureSection = () => {
  return (
    <section className="py-32 px-4 md:px-16">
      <span className="text-primary-500 pt-24 -mt-24" id="features">Features</span>
      <h2 className="text-4xl tracking-tight mt-2 sm:text-5xl">
        <div className="font-bold max-w-2xl">Get better insights, faster.</div>
        <div className="max-w-xl">Powerful analytics on metrics that matter.</div>
      </h2>
      <FeatureToggle/>
    </section>
  )
}

export default FeatureSection;

const FeatureToggle = () => {
  const [value, setValue] = useState('item-1')

  const handleValueChange = (newValue: string) => {
    if (!newValue) {
      return;
    }

    setValue(newValue);
  }

  return (
    <div className="flex h-full mt-12 items-center gap-12 md:mt-0 md:h-[540px]">
      <Accordion className="w-full md:w-2/5" type="single" collapsible value={value} onValueChange={handleValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <LucideSparkles className="h-5 w-5"/> AI-powered
          </span>
          </AccordionTrigger>
          <AccordionContent className="text-base text-gray-700">
            GoodBI learns from your data, and generates actionable key insights from your data in a few minutes to
            empower your business goals.
            <AiFeature className="block h-[368px] md:hidden md:h-[500px]"/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <LucideChartArea className="h-5 w-5"/> Data visualisations
          </span>
          </AccordionTrigger>
          <AccordionContent className="text-base text-gray-700">
            Unlock dynamic, real-time data visualisations at the click of a button! Transform your data
            into bar, line, or pie charts effortlessly.
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
          <AccordionContent className="text-base text-gray-700">
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