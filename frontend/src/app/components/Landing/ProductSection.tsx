"use client"

import Meteors from "@/app/components/Landing/Meteors";
import Globe from "@/app/components/Landing/Globe";
import RetroGrid from "@/app/components/Landing/RetroGrid";

const ProductSection = () => {
  return (
    <div className="bg-gray-50 rounded-2xl py-24">
      <div className="mx-auto text-center px-4 w-full max-w-2xl">
        <span className="text-primary-500" id="product">Product</span>
        <h2 className="font-bold text-4xl mt-2 sm:text-5xl">
          The ultimate <span className="text-primary-500">AI business intelligence</span> tool.
        </h2>
      </div>
      <div className="grid grid-cols-1 max-w-5xl mx-auto gap-4 mt-12 px-8 md:grid-cols-3">
        <div className="relative overflow-hidden bg-white rounded-xl h-[216px] border border-gray-200/70">
          <Meteors number={200}/>
          <div className="flex flex-col h-full justify-end p-5">
            <h3 className="text-lg font-bold">Effortless insights</h3>
            <p className="leading-5 text-gray-500">No knowledge in business intelligence required.</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white rounded-xl h-[216px] border border-gray-200/70">
          <Globe className="relative h-48 w-48 mb-6"/>
          <div className="absolute bottom-0 p-5 z-10">
            <h3 className="text-lg font-bold">Works anywhere</h3>
            <p className="leading-5 text-gray-500">On any device, from mobile phones to desktops.</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white rounded-xl h-[216px] border border-gray-200/70">
          <RetroGrid/>
          <div className="flex flex-col h-full justify-end p-5 relative">
            <h3 className="text-lg font-bold">Designed for speed</h3>
            <p className="leading-5 text-gray-500">Generate key performance indicators in just minutes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSection
