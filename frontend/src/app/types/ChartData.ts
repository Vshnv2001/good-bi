import { ChartConfig } from "@/components/ui/chart"

export enum ChartType {
    Bar = "bar",
    Line = "line",
    Pie = "pie"
}

export type ChartData = {
    chartConfig: ChartConfig,
    data: object[]
}

export type BarChartData = ChartData & {
    xAxisDataKey: string,
    dataKeys: string[]
}

export type LineChartData = ChartData & {
    xAxisDataKey: string,
    dataKeys: string[]
}

export type PieChartData = ChartData & {
    nameKey: string,
    dataKey: string
}

