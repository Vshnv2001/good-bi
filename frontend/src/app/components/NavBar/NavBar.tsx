"use client";

import { usePathname } from 'next/navigation'

import Link from "next/link"
import Image from 'next/image';

import { Menu, CircleUser, Share, LogOut, HelpCircle, Facebook, FacebookIcon, LinkedinIcon } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Session from "supertokens-web-js/recipe/session";
import Script from "next/script";

const NavBar = () => {
  const currentPath = usePathname();

  const signOut = async () => {
    await Session.signOut();
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 flex h-14 items-center gap-4 bg-background px-4 justify-between z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5"/>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-normal mt-8">
            <Link
              href="/dashboard"
              className={`${currentPath.includes("/dashboard") ? "" : "text-muted-foreground"} hover:text-foreground`}
            >
              Dashboard
            </Link>
            <Link
              href="/datasets"
              className={`${currentPath.includes("/datasets") ? "" : "text-muted-foreground"} hover:text-foreground`}
            >
              Datasets
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-2xl text-primary-500 font-extrabold md:flex"
      >
        <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" width="32" height="32"/>
        GoodBI
        <span className="sr-only">GoodBI</span>
      </Link>
      <nav
        className="hidden flex-col gap-6 text-base font-normal gap-6 md:flex md:w-full md:flex-row md:items-center md:justify-center">
        <Link
          href="/dashboard"
          className={`${currentPath.includes("/dashboard") ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
        >
          Dashboard
        </Link>
        <Link
          href="/datasets"
          className={`${currentPath.includes("/datasets") ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
        >
          Datasets
        </Link>

      </nav>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5"/>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href="mailto:cs3216-staff@googlegroups.com">
                <HelpCircle className="size-4 mr-1.5"/>
                Need help? Email us.
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
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
              <LogOut className="size-4 mr-1.5"/>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
};

export default NavBar;