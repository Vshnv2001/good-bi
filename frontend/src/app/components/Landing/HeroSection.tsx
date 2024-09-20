"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {DashboardCard} from "@/app/components/DashboardCard";
import {ChartConfig} from "@/components/ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {Responsive, WidthProvider} from "react-grid-layout";
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const layout = [
  {i: 'a', x: 0, y: 0, w: 1, h: 1},
  {i: 'b', x: 1, y: 0, w: 1, h: 1},
  {i: 'c', x: 0, y: 1, w: 2, h: 1},
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const chartData = [
  {month: "January", desktop: 186, mobile: 80},
  {month: "February", desktop: 305, mobile: 200},
  {month: "March", desktop: 237, mobile: 120},
  {month: "April", desktop: 73, mobile: 190},
  {month: "May", desktop: 209, mobile: 130},
  {month: "June", desktop: 214, mobile: 140},
]

const HeroSection = () => {
  return (
    <section className="bg-primary-50 overflow-hidden h-[calc(100lvh-60px)] min-h-[500px] rounded-2xl py-20">
      <div className="mx-auto text-center px-4 w-full max-w-2xl">
        <h1 className="font-bold text-5xl sm:text-6xl">
          Say <span className="text-primary-500">goodbye</span> to complex analytics.
        </h1>
        <p className="text-gray-700 leading-6 text-lg md:text-xl pt-4">
          GoodBI takes away the complexity of business intelligence with the power of AI. Trusted by many
          high-growth startups.
        </p>
        <Button
          className="text-white text-lg rounded-xl bg-primary-700 shadow-none p-5 hover:bg-primary-600 mt-6"
          asChild
        >
          <Link href="/signup">
            Try it free!
          </Link>
        </Button>
      </div>
      <div className="p-4 max-w-4xl mx-auto mt-12">
        <div className="bg-gray-50 h-svh p-2 rounded-2xl shadow-lg">
          <ResponsiveGridLayout
            className="layout"
            layouts={{lg: layout}}
            cols={{lg: 2, md: 2, sm: 2, xs: 1, xxs: 1}}
            rowHeight={200}
            maxRows={2}
          >
            <DashboardCard key="a" cardTitle="Chart 1" chartConfig={chartConfig} className="[&_h3]:text-base">
              <BarChart accessibilityLayer data={chartData} margin={{
                left: -20,
              }}>
                <CartesianGrid vertical={false}/>
                <XAxis
                  dataKey="month"
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
              </BarChart>
            </DashboardCard>
            <DashboardCard key="b" cardTitle="Chart 2" chartConfig={chartConfig} className="[&_h3]:text-base">
              <BarChart accessibilityLayer data={chartData} margin={{
                left: -20,
              }}>
                <CartesianGrid vertical={false}/>
                <XAxis
                  dataKey="month"
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
              </BarChart>
            </DashboardCard>
            <DashboardCard key="c" cardTitle="Chart 3" chartConfig={chartConfig} className="[&_h3]:text-base">
              <BarChart accessibilityLayer data={chartData} margin={{
                left: -20,
              }}>
                <CartesianGrid vertical={false}/>
                <XAxis
                  dataKey="month"
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
              </BarChart>
            </DashboardCard>
          </ResponsiveGridLayout>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
