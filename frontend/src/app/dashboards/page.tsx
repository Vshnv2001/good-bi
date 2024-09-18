"use client";

import { Search } from "lucide-react";

import { Area, AreaChart, Bar, BarChart, Pie, PieChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import { NavBar } from "../components/NavBar";

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

export default function Dashboard() {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
      <NavBar />
      <main className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200">
        <div className="mx-4 my-4 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
          <h1 className="text-3xl font-normal text-gray-800">Dashboard</h1>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <form>
              <div className="relative flex flex-col justify-center">
                <Search className="absolute left-3 h-4.5 w-4.5 text-gray-900" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-10 rounded-xl text-base font-normal border border-gray-200 bg-white shadow-none md:w-56"
                />
              </div>
            </form>
            <Button className="font-normal rounded-xl bg-goodbi-pri py-3 shadow-none">Create New</Button>
          </div>
        </div>
        <div className="mx-4 pb-4 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-0 shadow-none max-h-fit">
              <CardHeader className="p-3">
                <CardTitle className="text-xl text-gray-800 font-bold">Card Title</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none max-h-fit">
              <CardHeader className="p-3">
                <CardTitle className="text-xl text-gray-800 font-bold">Card Title</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <AreaChart accessibilityLayer data={chartData} margin={{
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
                    <Area dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Area dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none max-h-fit">
              <CardHeader className="p-3">
                <CardTitle className="text-xl text-gray-800 font-bold">Card Title</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <PieChart accessibilityLayer data={chartData} margin={{
                    left: -20,
                  }}>
                    <Pie data={chartData} dataKey="desktop" />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}
