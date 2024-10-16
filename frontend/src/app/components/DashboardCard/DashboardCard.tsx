"use client";

import Link from "next/link"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Edit, EllipsisVertical, Trash } from "lucide-react";

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
import { Button } from "@/components/ui/button";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    data: DashboardCardData,
    deleteInsight: (projectId: string, insightId: string) => void
}

const DashboardCard = React.forwardRef<
    HTMLDivElement,
    DashboardCardProps
>(({ data, deleteInsight, children, className, ...props }, ref) => {
    return (
        <Card ref={ref} className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{data.title}</CardTitle>
                <div className="flex items-center md:ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <EllipsisVertical className="text-gray-500 w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/dashboard/${data.projectId}/insights/${data.id}/update`}>
                                <DropdownMenuItem>
                                    <Edit className="size-4 mr-1.5" />
                                    Edit
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => deleteInsight(data.projectId, data.id)}>
                                <Trash className="size-4 mr-1.5" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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