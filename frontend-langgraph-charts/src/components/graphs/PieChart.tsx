import React from 'react'
import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart"
import { PieChartData } from "@/types/ChartData";

export interface PieChartProps {
  data: {
    id: number
    value: number
    label: string
  }[]
}

export const exampleData: PieChartProps = {
  data: [
    { id: 0, value: 10, label: 'a' },
    { id: 1, value: 15, label: 'b' },
    { id: 2, value: 20, label: 'c' },
  ],
}

const GBPieChart = ({ chartData }: { chartData: PieChartData }) => {
  return (
      <ChartContainer config={chartData.chartConfig} className="w-full">
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

const PieChartComponent: React.FC<PieChartProps> = ({ data }) => {
  let chartData: any = []

  const pieChartConfig: any = {
    sliceLabel: {
      label: "sliceLabel",
    },
  } satisfies ChartConfig


  data.map((value, index) => {
    chartData.push({
      'sliceLabel': value.label,
      'value': value.value,
      'fill': `hsl(var(--chart-${index + 1}))`
    })

    pieChartConfig[value['label']] = {
      label: value['label'],
      color: `hsl(var(--chart-${index + 1}))`
    }
  });

  const pieCartData = {
    chartConfig: pieChartConfig,
    data: chartData,
    nameKey: 'sliceLabel',
    dataKey: 'value'
  } as PieChartData;

  return (
    <GBPieChart chartData={pieCartData} />
  )
}

export default PieChartComponent
