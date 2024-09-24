"use client";

import { ChevronRight, Pencil, RotateCw, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import SessionCheck from "@/app/components/SessionCheck";
import GBBarChart from "@/app/components/Charts/BarChart";
import { BarChartData, ChartType } from "@/app/types/ChartData";
import { ChartConfig } from "@/components/ui/chart";

const FormSchema = z.object({
  dataset: z
    .string({
      required_error: "Please select a dataset.",
    }),
  chartType: z.string({
    required_error: "Please select a chart type.",
  }),
  dateRange: z.object(
    {
      start: z.date(),
      end: z.date(),
    },
    {
      required_error: "Please select a date range",
    }
  ),
  yRange: z.coerce.number({
    required_error: "Please enter a valid y range.",
  }),
  title: z.string({
    required_error: "Please enter a title.",
  }),
  kpiDescription: z.string({
    required_error: "Please provide a KPI description.",
  })
})

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

const browserData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const barChartData = {
  chartConfig: chartConfig,
  data: browserData,
  xAxisDataKey: "month",
  dataKeys: ["desktop", "mobile"]
} as BarChartData;

export default function NewDashboard({ params }: { params: { projectid: string } }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/projects/${params.projectid}/insights`, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (res.status == 200) {
      let responseData = await res.json()
      window.location.href = `/projects/${params.projectid}/dashboard`
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <div className="mx-4 my-2 flex flex-row gap-1 items-center">
          <span className="text-sm text-gray-500 font-normal">Dashboard</span>
          <ChevronRight className="text-gray-500 h-3 w-3" />
          <span className="text-sm text-gray-500 font-normal">New insight</span>
        </div>
        <main className="flex max-h-[calc(100vh_-_6.5rem)] flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          <div className="px-3 pt-7 w-full max-w-sm items-center align-center min-h-0">
            <h1 className="pb-3.5 text-center text-3xl font-normal text-gray-800">Preview</h1>
            <div className="sm:px-4 py-3.5 flex flex-grow w-full">
              <Card className="h-83 w-full">
                <CardContent className="relative flex flex-grow px-3 py-3 h-full overflow-hidden w-full">
                  <GBBarChart chartData={barChartData} />
                  <div className="absolute flex flex-col gap-2 top-3 right-3">
                    <div className="bg-white border rounded-lg h-8 w-8 flex items-center justify-center">
                      <Pencil className="h-5 w-5" />
                    </div>
                    <div className="bg-white border rounded-lg h-8 w-8 flex items-center justify-center">
                      <ThumbsUp className="h-5 w-5" />
                    </div>
                    <div className="bg-white border rounded-lg h-8 w-8 flex items-center justify-center">
                      <ThumbsDown className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="pt-3.5 pb-5 flex flex-cols gap-2 text-base text-gray-500 items-center justify-center">
              <RotateCw className="h-4 w-4" />
              <span>Regenerate</span>
            </div>
            <div className="pb-7">
              <Button className="w-full">
                Confirm
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SessionCheck>
  )
}
