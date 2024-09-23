"use client";

import Link from "next/link"

import * as React from "react"
import { cn } from "@/lib/utils"

import { EllipsisVertical } from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { format } from "date-fns"

import { ProjectCardData } from "@/app/types/ProjectCardData"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    project: ProjectCardData
}

const ProjectCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ project, children, className, ...props }, ref) => {

    async function deleteProject() {
        let res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/projects/${project.id}/delete`, {
            method: 'POST'
        })
        let responseData = await res.json()
    }

    return (
        <Card ref={ref} className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="flex-row items-center justify-between">
                <Link href={`/projects/${project.id}/dashboard`} className="flex-grow">
                    <CardTitle>{project.name}</CardTitle>
                </Link>
                <div className="flex items-center md:ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <EllipsisVertical className="text-gray-500 w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/projects/${project.id}/update`}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => deleteProject()}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <Link href={`/projects/${project.id}/dashboard`}>
                <CardFooter>
                    <p>Updated {format(project.lastUpdated, "dd MMM yyyy")}</p>
                </CardFooter>
            </Link>
        </Card>
    );
});
ProjectCard.displayName = "ProjectCard"

export default ProjectCard;