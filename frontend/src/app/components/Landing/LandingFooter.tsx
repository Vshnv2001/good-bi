"use client"

import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";

const LandingFooter = ({className}: { className?: string }) => {
  return (
    <footer className={cn("py-4 bg-gray-100", className)}>
      <div className="px-4 max-w-7xl mx-auto flex gap-8 justify-between items-center">
        <div className="flex items-center gap-2 text-3xl text-primary-500 font-extrabold">
          <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-10 w-8" width="28"
                 height="28"/>
          GoodBI
          <span className="sr-only">GoodBI</span>
        </div>
        <nav className="justify-end flex flex-wrap gap-y-3 gap-x-7 text-gray-600 flex-col min-[528px]:flex-row">
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
          <Link className="transition-colors duration-100 hover:text-primary-700" href="/#faq">
            FAQ
          </Link>
        </nav>
      </div>
      <div className="text-sm mt-4 text-gray-500 px-4 max-w-7xl mx-auto border-t">
        <div className="flex flex-col-reverse items-center min-[400px]:flex-row gap-y-3 justify-between mt-4">
          <span className="block">
            &copy; {new Date().getFullYear()} GoodBI.
          </span>
          <div className="flex gap-3 text-right">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <span className="text-sm text-gray-300">|</span>
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
