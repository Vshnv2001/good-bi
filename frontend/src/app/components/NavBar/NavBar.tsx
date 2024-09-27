"use client";

import { usePathname } from 'next/navigation'

import Link from "next/link"
import Image from 'next/image';

import { Menu, CircleUser, LogOut, HelpCircle, FacebookIcon, LinkedinIcon } from "lucide-react";

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
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const NavBar = () => {
  const currentPath = usePathname();
  const [name, setName] = useState("");

  const signOut = async () => {
    await Session.signOut();
    window.location.href = "/"
  }

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/data`)
      .then((res) => {
        setName(res.data.name)
      })
      .catch(() => {
        toast.error("Unable to fetch name.");
      })
  }, []);

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
        className="flex items-center gap-2 text-2xl text-primary-500 font-extrabold font-logo md:flex"
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
              <Avatar>
                <AvatarFallback>{name ? name.split(/\s+/).map((word) => word[0].toUpperCase()).slice(0,2).join("") : ''}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {name && <DropdownMenuLabel>{name}</DropdownMenuLabel>}
            {name && <DropdownMenuSeparator/>}
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href="mailto:cs3216-staff@googlegroups.com">
                <HelpCircle className="size-4 mr-1.5"/>
                Need help? Email us.
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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