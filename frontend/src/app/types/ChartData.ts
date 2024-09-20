import { ChartConfig } from "@/components/ui/chart"

interface ChartData {
    chartConfig: ChartConfig,
    data: {}[]
}

export interface BarChartData extends ChartData {
    xAxisDataKey: string,
    dataKeys: string[]
}

export interface LineChartData extends ChartData {
    xAxisDataKey: string,
    dataKeys: string[]
}

export interface PieChartData extends ChartData {
    nameKey: string,
    dataKey: string
}

