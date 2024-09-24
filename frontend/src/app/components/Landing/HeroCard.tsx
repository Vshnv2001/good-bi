"use client";

import Link from "next/link"

import * as React from "react"
import { cn } from "@/lib/utils"

import { EllipsisVertical } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DashboardCardData } from "@/app/types/DashboardCardData";
import { BarChartData, ChartType, LineChartData, PieChartData } from "@/app/types/ChartData";
import GBBarChart from "../Charts/BarChart";
import GBLineChart from "../Charts/LineChart";
import GBPieChart from "../Charts/PieChart";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    data: DashboardCardData,
    deleteInsight: (projectId: string, insightId: string) => void
}

const HeroCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ data, children, className, ...props }, ref) => {
    return (
        <Card ref={ref} className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow px-3 pb-3 max-h-full overflow-hidden w-full">
                {
                    data.chartType == ChartType.Bar
                        ? <GBBarChart chartData={data.chartData as BarChartData} />
                        : data.chartType == ChartType.Line
                            ? <GBLineChart chartData={data.chartData as LineChartData} />
                            : data.chartType == ChartType.Pie
                                ? <GBPieChart chartData={data.chartData as PieChartData} />
                                : <div></div>
                }
                {children}
            </CardContent>
        </Card>
    );
});
HeroCard.displayName = "DashboardCard"

export default HeroCard;