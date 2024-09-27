"use client"

import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";
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
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <a href="https://api.whatsapp.com/send?text=https://good-bi.vercel.app" target="_blank">
                    <svg className="size-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor"
                            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/>
                    </svg>
                    Share on WhatsApp
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <a href="https://t.me/share/url?url=https://good-bi.vercel.app" target="_blank">
                    <svg className="size-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2"
                            d="m11.985 15.408l3.242 3.686c1.2 1.365 1.801 2.048 2.43 1.881c.628-.166.844-1.064 1.275-2.861l2.39-9.968c.665-2.768.997-4.151.259-4.834s-2.017-.175-4.575.84L5.14 8.865c-2.046.813-3.069 1.219-3.134 1.917a1 1 0 0 0 0 .214c.063.699 1.084 1.108 3.128 1.927c.925.371 1.388.557 1.72.912q.056.06.108.124c.306.38.436.88.697 1.876l.489 1.867c.253.97.38 1.456.713 1.522s.622-.336 1.201-1.141zm0 0l-.317-.33c-.362-.378-.543-.566-.543-.8s.18-.423.543-.8l3.573-3.724"
                            color="currentColor"/>
                    </svg>
                    Share on Telegram
                  </a>
                </DropdownMenuItem>
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
