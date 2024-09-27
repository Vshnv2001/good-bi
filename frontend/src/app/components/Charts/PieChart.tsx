import * as React from "react"

import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { PieChartData } from "@/app/types/ChartData";

const GBPieChart = ({ chartData }: { chartData: PieChartData }) => {
    return (
        <ChartContainer config={chartData.chartConfig} className="min-h-[200px] w-full">
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={chartData.data} dataKey={chartData.dataKey} nameKey={chartData.nameKey} />
                <ChartLegend
                    content={<ChartLegendContent nameKey={chartData.nameKey} />}
                    className='-translate-y-2 flex-wrap gap-2 basis-1/4 justify-center'
                />
            </PieChart>
        </ChartContainer>

    )
}

export default GBPieChart;