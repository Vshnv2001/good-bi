"use client"

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQSection() {
  return (
    <section>
      <div className="flex w-full flex-col justify-center space-y-2 items-center">
        <span className="text-primary-500 pt-24 -mt-24 mx-auto text-center" id="faq">FAQ</span>
        <h2 className="font-bold text-4xl mt-2 tracking-tight sm:text-5xl text-center">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="max-w-2xl mx-auto mt-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is GoodBI?</AccordionTrigger>
          <AccordionContent>
            GoodBI is platform to help you generate key performance indicators from your business data, using artificial
            intelligence models. It provides actionable recommendations based on your specific needs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How does GoodBI work?</AccordionTrigger>
          <AccordionContent>
            GoodBI processes your data to extract key insights, which are then shared with our artificial intelligence
            models. Since the data processing happens locally on your machine, your information remains safe and secure.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What type of data is supported?</AccordionTrigger>
          <AccordionContent>
            You can upload only CSV files. We can process numerical, categorical, and text data. We are looking to
            support more file types, including Excel files in the near future.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is my business data safe?</AccordionTrigger>
          <AccordionContent>
            We take data privacy seriously. Your business data are anonymised and securely stored, in compliance with
            privacy regulations. Please refer to our <Link className="underline" href="/privacy-policy">Privacy
            Policy</Link> for more details.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>How much does it cost?</AccordionTrigger>
          <AccordionContent>
            We offer a variety of pricing plans, including a free version with limitations. Premium plans provide
            additional capabilities and support. See our <Link className="underline" href="/#pricing">pricing</Link> for
            more details.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}