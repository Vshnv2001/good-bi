"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

import { EllipsisVertical } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    key: string,
    cardTitle: string,
    children: React.ReactElement
}

const DashboardCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ key, cardTitle, children, className, ...props }, ref) => {
    return (
        <Card ref={ref} key={key} className={cn("flex flex-col border-0 shadow-none", className)} {...props}>
            <CardHeader className="p-3 space-y-0 flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-800 font-bold">{cardTitle}</CardTitle>
                <EllipsisVertical className="text-gray-500 w-5 h-5" />
            </CardHeader>
            <CardContent className="flex flex-grow px-3 pb-3 max-h-full overflow-hidden w-full">
            {children}
                
            </CardContent>
        </Card>
    );
});
DashboardCard.displayName = "DashboardCard"

export default DashboardCard;