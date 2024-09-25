"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import { Pencil, RotateCw, ThumbsDown, ThumbsUp, CalendarDays } from "lucide-react";

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {zodResolver} from "@hookform/resolvers/zod"
import {format} from "date-fns"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {NavBar} from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import SessionCheck from "@/app/components/SessionCheck";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import PrivacyModal from "@/app/components/PrivacyModal";
import TermsOfServiceModal from "@/app/components/TermsOfServiceModal";
import { useRouter } from "next/navigation";


import GBBarChart from "@/app/components/Charts/BarChart";
import { BarChartData, ChartType } from "@/app/types/ChartData";
import { ChartConfig } from "@/components/ui/chart";
import { toast } from "sonner";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

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

const FormSchema = z.object({
  dataset: z
    .string({
      required_error: "Please select a dataset.",
    }).min(1, "Please select a dataset."),
  chartType: z.string({
    required_error: "Please select a chart type.",
  }).min(1, "Please select a chart type."),
  dateRange: z.object(
    {
      start: z.date(),
      end: z.date(),
    },
    {
      required_error: "Please select a date range",
    }
  ),
  title: z.string({
    required_error: "Please enter a title.",
  }).min(1, "Please enter a title."),
  kpiDescription: z.string({
    required_error: "Please enter a KPI description.",
  }).min(1, "Please enter a KPI description.")
})

export default function NewDashboard({params}: { params: { projectid: string } }) {
  const router = useRouter();

  const [datasets, setDatasets] = useState<string[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [insightFormData, setInsightFormData] = useState<FormData>();

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/datasetnames`);

      if (res.status == 200) {
        const data = await res.json();

        setDatasets(data.data);
      }
    }
    fetchProjects()
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      dataset: "",
      chartType: ChartType.Bar,
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      title: "",
      kpiDescription: ""
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    formData.append('dataset_id', '7bf63769-f738-4bab-8d86-bfd18fa1341f')
    formData.append('chart_type', data.chartType);
    formData.append('start_date', format(data.dateRange.start, "MM-dd-yyyy"))
    formData.append('end_date', format(data.dateRange.end, "MM-dd-yyyy"))
    // Replace y_range with actual values
    formData.append('y_range_start', '0')
    formData.append('y_range_end', '999')
    formData.append('title', data.title)
    formData.append('kpi_description', data.kpiDescription)
    formData.append('project_id', params.projectid)

    setInsightFormData(formData);
    setIsFormSubmitted(true);
  }

  async function onConfirm() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights/new`, {
      method: 'POST',
      body: insightFormData
    });

    if (res.status == 200) {
      const responseData = await res.json()
      toast("New insight has been created.")
      router.push(`/dashboard`)
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <Breadcrumb className="mx-4 my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard`}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New insight</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          {isFormSubmitted ? <div className="px-3 pt-7 w-full max-w-sm items-center align-center min-h-0">
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
              <Button className="w-full" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </div> : <div className="px-3 pt-7 flex flex-col w-full max-w-sm items-center align-center flex-grow min-h-0">
            <h1 className="pb-5 text-center text-3xl font-normal text-gray-800">Create a new insight</h1>
            <div className="sm:px-4 pt-5 pb-3 flex flex-grow w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
                  <FormField
                    control={form.control}
                    name="dataset"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Dataset</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              className="px-3 py-4 rounded-xl text-base data-[placeholder]:text-gray-500 border border-gray-200/70 bg-white shadow-none">
                              <SelectValue className="" placeholder="Select"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {datasets.map((dataset) => {
                              return (
                                <SelectItem key={dataset} value={dataset}>{dataset}</SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chartType"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Type of chart</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              className="px-3 py-4 rounded-xl text-base data-[placeholder]:text-gray-500 border border-gray-200/70 bg-white shadow-none">
                              <SelectValue className="" placeholder="Select chart type"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bar">Bar</SelectItem>
                            <SelectItem value="pie">Pie</SelectItem>
                            <SelectItem value="line">Line</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Date range</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild
                                          className="rounded-xl text-base border border-gray-200/70 bg-white shadow-none">
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 justify-start text-left font-normal",
                                  !field.value.start && "text-muted-foreground"
                                )}
                              >
                                {field.value.start && (
                                  field.value.end ? (
                                    <>
                                      {format(field.value.start, "LLL dd y")} -{" "}
                                      {format(field.value.end, "LLL dd y")}
                                    </>
                                  ) : (
                                    format(field.value.start, "LLL dd y")
                                  )
                                )}
                                <CalendarDays className="ml-auto h-4 w-4 opacity-50"/>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={{
                                from: field.value.start,
                                to: field.value.end
                              }}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Title</FormLabel>
                        <Input
                          type="text"
                          {...field}
                        />
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kpiDescription"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>KPI description</FormLabel>
                        <Textarea
                          className="h-28 resize-none"
                          {...field}
                        />
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    Create
                  </Button>
                </form>
              </Form>
            </div>
            <div className="pt-3 pb-7 text-sm text-center text-gray-500">
              <span>GoodBI may share some information with third parties to generate insights. For more information, view our </span>
              <PrivacyModal>
                <button className="underline decoration-inherit">Privacy Policy</button>
              </PrivacyModal>
              <span> and </span>
              <TermsOfServiceModal>
                <button className="underline decoration-inherit">Terms of Service</button>
              </TermsOfServiceModal>
              <span>.</span>
            </div>
          </div>}
        </main>
      </div>
    </SessionCheck>
  )
}
