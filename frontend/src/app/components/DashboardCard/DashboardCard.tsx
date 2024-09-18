"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    key: string,
    cardTitle: string,
    chartConfig: ChartConfig,
    children: React.ReactElement
}

const DashboardCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ key, cardTitle, chartConfig, children, className, ...props }, ref) => {
    return (
        <Card ref={ref} key={key} className={cn("flex flex-col border-0 shadow-none", className)} {...props}>
            <CardHeader className="p-3">
                <CardTitle className="text-xl text-gray-800 font-bold">{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow px-3 pb-3 max-h-full overflow-hidden w-full">
                <ChartContainer config={chartConfig} className="w-full">
                    {children}
                </ChartContainer>
            </CardContent>
        </Card>
    );
});

export default DashboardCard;