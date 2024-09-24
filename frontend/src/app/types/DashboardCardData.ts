import { ChartData, ChartType } from "./ChartData"

export type DashboardCardData = {
    id: string,
    key: string,
    title: string,
    chartType: ChartType,
    chartData: ChartData,
    projectId: string
}