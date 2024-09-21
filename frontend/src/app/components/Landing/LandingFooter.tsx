"use client"

import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";

const LandingFooter = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("py-8 bg-gray-100", className)}>
      <div className="px-4 max-w-7xl mx-auto flex gap-12 justify-between items-center">
        <div>
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
      </div>
    </footer>
  )
}

export default LandingFooter
