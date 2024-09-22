"use client";

import Link from "next/link"

import { Search } from "lucide-react";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartConfig } from "@/components/ui/chart"

import { Responsive, WidthProvider } from "react-grid-layout";

import { NavBar } from "@/app/components/NavBar";
import { DashboardCard } from "@/app/components/DashboardCard";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const layouts = {
  sm: [
    { i: "a", x: 0, y: 0, w: 1, h: 1, static: true },
    { i: "b", x: 1, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "c", x: 2, y: 0, w: 1, h: 1, minH: 1, minW: 1 }
  ],
  md: [
    { i: "a", x: 0, y: 0, w: 1, h: 1, static: true },
    { i: "b", x: 1, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "c", x: 2, y: 0, w: 1, h: 1, minH: 1, minW: 1 }
  ],
  lg: [
    { i: "a", x: 0, y: 0, w: 1, h: 1, static: true },
    { i: "b", x: 1, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "c", x: 2, y: 0, w: 1, h: 1, minH: 1, minW: 1 }
  ]
};

export default function Dashboard() {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
      <NavBar />
      <main className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200/70">
        <div className="mx-4 my-3 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
          <h1 className="text-3xl font-normal text-gray-800">Dashboard</h1>
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <form>
              <div className="relative flex flex-col justify-center">
                <Search className="absolute left-3 h-4.5 w-4.5 text-gray-900 " />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-10 rounded-xl text-base placeholder:text-gray-500 border border-gray-200/70 bg-white shadow-none md:w-56"
                />
              </div>
            </form>
            <Button asChild>
              <Link href="/dashboard/new">
                Create New
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-4 pb-4 flex-grow overflow-y-auto">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ sm: 640, md: 768, lg: 1024 }}
            cols={{ sm: 1, md: 2, lg: 3 }}
            containerPadding={[0, 0]}
            margin={[16, 16]}
            rowHeight={275}
            compactType="horizontal"
            draggableCancel=".react-resizable-handle-custom"
          >
            <DashboardCard key="a" cardTitle="Dash 1" chartConfig={chartConfig}>
              <BarChart accessibilityLayer data={chartData} margin={{
                left: -20,
              }}>
                <CartesianGrid vertical={false} />
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </DashboardCard>
            <DashboardCard key="b" cardTitle="Dash 2" chartConfig={chartConfig}>
              <BarChart accessibilityLayer data={chartData} margin={{
                left: -20,
              }}>
                <CartesianGrid vertical={false} />
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </DashboardCard>
            <DashboardCard key="c" cardTitle="Dash 3" chartConfig={chartConfig}>
              <BarChart accessibilityLayer data={chartData} margin={{
                left: -20,
              }}>
                <CartesianGrid vertical={false} />
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </DashboardCard>
          </ResponsiveGridLayout>
        </div>
      </main>
    </div>
  )
}
