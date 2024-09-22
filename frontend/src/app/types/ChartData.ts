import { ChartConfig } from "@/components/ui/chart"

interface ChartData {
    chartConfig: ChartConfig,
    data: {}[]
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

