import React from 'react'
import { Bar, BarChart as ReBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartConfig } from "@/components/ui/chart"
import { BarChartData } from '@/types/ChartData'

export interface BarGraphProps {
  data: {
    labels: string[]
    values: { data: number[]; label: string }[]
  }
}

export const exampleData: BarGraphProps = {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [{ data: [21.5, 25.0, 47.5, 64.8, 105.5, 133.2], label: 'Income' }],
  },
}

export const exampleData2: BarGraphProps = {
  data: {
    labels: ['series A', 'series B', 'series C'],
    values: [
      { data: [10, 15, 20], label: 'American' },
      { data: [20, 25, 30], label: 'European' },
    ],
  },
}

const GBBarChart = ({ chartData }: { chartData: BarChartData }) => {
    return (
        <ChartContainer config={chartData.chartConfig} className="w-full">
            <ReBarChart accessibilityLayer data={chartData.data} margin={{
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
                            <Bar key={dataKey} dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
                        )
                    })
                }
            </ReBarChart>
        </ChartContainer>
    )
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  // Sort the data according to labels
  const sortedData = {
    ...data,
    labels: [...data.labels].sort((a, b) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    }),
    values: data.values.map((value) => ({
      ...value,
      data: data.labels
        .map((label, index) => ({ label, value: value.data[index] }))
        .sort((a, b) => {
          const numA = parseFloat(a.label)
          const numB = parseFloat(b.label)
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB
          }
          return a.label.localeCompare(b.label)
        })
        .map((item) => item.value),
    })),
  }

  const chartConfig: any = {} satisfies ChartConfig;

  let chartData: any = []
  let dataKeys: string[] = []

  sortedData.values.map((value, index) => {
    dataKeys.push(value['label'])
    chartConfig[value['label']] = {
      label: value['label'],
      color: `hsl(var(--chart-${index + 1}))`
    }
  });

  sortedData.labels.map((label, index) => {
    let currentItem: any = {}
    currentItem['xAxisDataKey'] = label;

    sortedData.values.map((value) => {
      currentItem[value['label']] = value['data'][index];
    });

    chartData.push(currentItem)
  })

  const barChartData = {
    chartConfig: chartConfig,
    xAxisDataKey: 'xAxisDataKey',
    data: chartData,
    dataKeys: dataKeys
  } as BarChartData;

  return <GBBarChart chartData={barChartData} />
}

export default BarGraph
