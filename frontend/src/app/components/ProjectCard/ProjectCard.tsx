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

import { format } from "date-fns"

import { ProjectCardData } from "@/app/types/ProjectCardData"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    project: ProjectCardData
}

const ProjectCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ project, children, className, ...props }, ref) => {
    return (
        <Card ref={ref} className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="flex-row items-center justify-between">
                <Link href={`/projects/${project.id}/dashboard`} className="flex-grow">
                    <CardTitle>{project.name}</CardTitle>
                </Link>
                <EllipsisVertical className="text-gray-500 w-5 h-5" onClick={() => console.log("Test")} />
            </CardHeader>
            <Link href="/projects/1/dashboard">
                <CardFooter>
                    <p>Updated {format(project.lastUpdated, "dd MMM yyyy")}</p>
                </CardFooter>
            </Link>
        </Card>
    );
});
ProjectCard.displayName = "ProjectCard"

export default ProjectCard;