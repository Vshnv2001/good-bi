"use client";

import { usePathname } from 'next/navigation'

import Link from "next/link"
import Image from 'next/image';

import { Menu, CircleUser } from "lucide-react";

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

const NavBar = () => {
    const currentPath = usePathname();

    const signOut = async () => {
        await Session.signOut();
        window.location.href = "/" // TODO: Do we want to redirect to the login page?
    }

    return (
        <header className="sticky top-0 flex h-14 items-center gap-4 bg-background px-4 justify-between">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-normal mt-8">
                        <Link
                            href="/projects"
                            className={`${currentPath === "/projects" ? "" : "text-muted-foreground"} hover:text-foreground`}
                        >
                            Projects
                        </Link>
                        <Link
                            href="/dataset"
                            className={`${currentPath === "/dataset" ? "" : "text-muted-foreground"} hover:text-foreground`}
                        >
                            Dataset
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <Link
                href="#"
                className="flex items-center gap-2 text-2xl text-primary-500 font-extrabold md:flex"
            >
                <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" width="32" height="32" />
                 GoodBI
                <span className="sr-only">GoodBI</span>
            </Link>
            <nav className="hidden flex-col gap-6 text-base font-normal gap-6 md:flex md:w-full md:flex-row md:items-center md:justify-center">
                <Link
                    href="/projects"
                    className={`${currentPath === "/projects" ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
                >
                    Projects
                </Link>
                <Link
                    href="/dataset"
                    className={`${currentPath === "/dataset" ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
                >
                    Dataset
                </Link>

            </nav>
            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default NavBar;