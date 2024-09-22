"use client";

import Link from "next/link"

import { Search, EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Responsive, WidthProvider } from "react-grid-layout";

import { NavBar } from "@/app/components/NavBar";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { ProjectCardData } from "@/app/types/ProjectCardData"
import { ProjectCard } from "../components/ProjectCard";

const ResponsiveGridLayout = WidthProvider(Responsive);

const projects: ProjectCardData[] = [
    {
        id: "1",
        name: "Project 1",
        lastUpdated: new Date()
    },
    {
        id: "2",
        name: "Project 2",
        lastUpdated: new Date()
    },
    {
        id: "3",
        name: "Project 3",
        lastUpdated: new Date()
    },
    {
        id: "4",
        name: "Project 4",
        lastUpdated: new Date()
    },
    {
        id: "5",
        name: "Project 5",
        lastUpdated: new Date()
    }
]

export default function Projects() {
    return (
        <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
            <NavBar />
            <main className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200/70">
                <div className="mx-4 my-3 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
                    <h1 className="text-3xl font-normal text-gray-800">Projects</h1>
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <form>
                            <div className="relative flex flex-col justify-center">
                                <Search className="absolute left-3 h-4.5 w-4.5 text-gray-900 " />
                                <Input
                                    type="search"
                                    placeholder="Search"
                                    className="pl-10 rounded-xl text-base placeholder:text-gray-500 border border-gray-200/70 bg-white shadow-none md:w-56"
                                />
                            </div>
                        </form>
                        <Button asChild>
                            <Link href="/projects/new">
                                Create New
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="mx-4 pb-4 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {
                            projects.map((project) => {
                                return (
                                    <ProjectCard key={project.id} project={project} />
                                )
                            })
                        }
                    </div>
                </div>
            </main>
        </div>
    )
}
