"use client"

import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dropdown } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FacebookIcon, LinkedinIcon } from "lucide-react";

const LandingFooter = ({className}: { className?: string }) => {
  return (
    <footer className={cn("py-4 bg-gray-100", className)}>
      <div className="px-4 max-w-7xl mx-auto flex gap-8 justify-between items-center">
        <div className="flex items-center gap-2 text-3xl text-primary-500 font-logo font-extrabold">
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
        <div className="flex flex-col-reverse items-center sm:flex-row gap-y-3 justify-between mt-4">
          <span className="block">
            &copy; {new Date().getFullYear()} GoodBI.
          </span>
          <div className="flex gap-3 text-right">
            <DropdownMenu>
              <DropdownMenuTrigger>Share</DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <FacebookIcon className="size-4 mr-1.5"/>
                  <div className="fb-share-button" data-href="https://good-bi.vercel.app" data-layout="" data-size=""><a
                    target="_blank"
                    href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgood-bi.vercel.app%2F&amp;src=sdkpreparse"
                    className="fb-xfbml-parse-ignore">Share on Facebook</a></div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://good-bi.vercel.app" target="_blank">
                    <LinkedinIcon className="size-4 mr-1.5"/>
                    Share on LinkedIn
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-gray-300">|</span>
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
