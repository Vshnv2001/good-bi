import * as React from "react"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { BarChartData } from "@/app/types/ChartData";

const GBBarChart = ({ chartData }: { chartData: BarChartData }) => {
    return (
        <ChartContainer config={chartData.chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData.data} margin={{
                right: 20
            }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={chartData.xAxisDataKey}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString().slice(0, 10)}
                />
                <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value > 1000000 ? `${(value / 1000000).toFixed(1)}M` : value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                {
                    chartData.dataKeys.map((dataKey, index) => {
                        return (
                            <Bar key={dataKey} dataKey={dataKey} fill={`hsl(var(--chart-${index + 1}))`} radius={4} />
                        )
                    })
                }
            </BarChart>
        </ChartContainer>

    )
}

export default GBBarChart;