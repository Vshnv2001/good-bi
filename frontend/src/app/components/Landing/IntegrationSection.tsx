"use client"

import { IntegrationIconCloud } from "@/app/components/Landing/IntegrationIconCloud";

const IntegrationSection = () => {
  return (
    <div className="bg-white rounded-2xl py-12">
      <div className="mx-auto max-w-5xl px-4 flex items-center justify-between gap-8 flex-col md:flex-row">
        <div className="max-w-md">
          <span className="text-primary-500" id="integration">Integration</span>
          <h2 className="text-4xl tracking-tight mt-2 sm:text-5xl">
            <span className="font-bold">All your needs, in one platform.</span>
          </h2>
          <p className="mt-6">
            Seamless integrations with your favourite business applications, from CRM tools to cloud storage.
          </p>
        </div>
        <IntegrationIconCloud/>
      </div>
    </div>
  )
}

export default IntegrationSection
