import * as React from "react"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { BarChartData } from "@/app/types/ChartData";

const GBBarChart = ({ chartData }: { chartData: BarChartData }) => {
    return (
        <ChartContainer config={chartData.chartConfig} className="w-full">
            <BarChart accessibilityLayer data={chartData.data} margin={{
                left: -20,
                right: 10
            }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={chartData.xAxisDataKey}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
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