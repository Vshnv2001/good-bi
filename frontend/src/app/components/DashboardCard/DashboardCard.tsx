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
import { DashboardCardData } from "@/app/types/DashboardCardData";
import { BarChartData, ChartType, LineChartData, PieChartData } from "@/app/types/ChartData";
import GBBarChart from "../Charts/BarChart";
import GBLineChart from "../Charts/LineChart";
import GBPieChart from "../Charts/PieChart";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    data: DashboardCardData,
}

const DashboardCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ data, children, className, ...props }, ref) => {
    return (
        <Card ref={ref} className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{data.title}</CardTitle>
                <EllipsisVertical className="text-gray-500 w-5 h-5" />
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
DashboardCard.displayName = "DashboardCard"

export default DashboardCard;