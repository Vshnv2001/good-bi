import * as React from "react"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { LineChartData } from "@/app/types/ChartData";

const GBLineChart = ({ chartData }: { chartData: LineChartData }) => {
    return (
        <ChartContainer config={chartData.chartConfig} className="w-full">
            <LineChart accessibilityLayer data={chartData.data} margin={{
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
                    chartData.dataKeys.map((dataKey) => {
                        return (
                            <Line type="natural" key={dataKey} dataKey={dataKey} stroke={`var(--color-${dataKey})`} strokeWidth={2} />
                        )
                    })
                }
            </LineChart>
        </ChartContainer>

    )
}

export default GBLineChart;