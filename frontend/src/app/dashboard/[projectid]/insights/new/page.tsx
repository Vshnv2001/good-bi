"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import { Pencil, RotateCw, ThumbsDown, ThumbsUp, CalendarDays, Info } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import SessionCheck from "@/app/components/SessionCheck";
import PrivacyModal from "@/app/components/PrivacyModal";
import TermsOfServiceModal from "@/app/components/TermsOfServiceModal";
import { useRouter } from "next/navigation";


import GBBarChart from "@/app/components/Charts/BarChart";
import { BarChartData, ChartData, ChartType, LineChartData, PieChartData } from "@/app/types/ChartData";
import { ChartConfig } from "@/components/ui/chart";
import { toast } from "sonner";
import GBLineChart from "@/app/components/Charts/LineChart";
import GBPieChart from "@/app/components/Charts/PieChart";
import RegenerateModal from "@/app/components/RegenerateModal";

const FormSchema = z.object({
  title: z.string({
    required_error: "Please enter a title.",
  }).min(1, "Please enter a title."),
  kpiDescription: z.string({
    required_error: "Please enter a KPI description.",
  }).min(1, "Please enter a KPI description.")
})

export default function NewDashboard({ params }: { params: { projectid: string } }) {
  const router = useRouter();

  const [datasets, setDatasets] = useState<string[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [visualizationType, setVisualizationType] = useState<string | null>(null);
  const [visualizationData, setVisualizationData] = useState<ChartData | null>(null);
  const [insightFormData, setInsightFormData] = useState<FormData>();
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatasetNames() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/datasetnames`);

      if (res.status == 200) {
        const data = await res.json();

        setDatasets(data.data);
      }
    }

    fetchDatasetNames()
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      title: "",
      kpiDescription: ""
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    formData.append('title', data.title)
    formData.append('kpi_description', data.kpiDescription)
    formData.append('project_id', params.projectid)

    const visualizeFormData = new FormData();
    visualizeFormData.append('query', data.kpiDescription);

    setInsightFormData(formData);
    setIsFormSubmitted(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visualize`, {
      method: 'POST',
      body: visualizeFormData
    });

    if (res.status == 200) {
      const responseData = await res.json();

      if ("error" in responseData) {
        toast.error(responseData["error"]);
        return;
      }

      const returnedVisualizationType = responseData["visualization"];

      if (returnedVisualizationType != "none") {
        const formattedVisualizationData = responseData['formatted_data_for_visualization']['formatted_data_for_visualization'];

        if ("explanation" in responseData) {
          setExplanation(responseData["explanation"])
        }
        
        if (returnedVisualizationType == "bar") {
          const formattedBarData = formattedVisualizationData as {
            labels: string[],
            values: { data: number[], label: string }[]
          }

          console.log(formattedBarData);

          const chartConfig: any = {} satisfies ChartConfig;

          const chartData: any = []
          const dataKeys: string[] = []

          formattedBarData.values.map((value, index) => {
            dataKeys.push(value['label'])
            chartConfig[value['label']] = {
              label: value['label'],
              color: `hsl(var(--chart-${index + 1}))`
            }
          });

          formattedBarData.labels.map((label, index) => {
            const currentItem: any = {}
            currentItem['xAxisDataKey'] = label;

            formattedBarData.values.map((value) => {
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

          formData.append('chart_type', ChartType.Bar);
          formData.append('visualization_data', JSON.stringify(barChartData));

          setVisualizationType(ChartType.Bar);
          setVisualizationData(barChartData);
        } else if (returnedVisualizationType == "line") {
          const formattedLineData = formattedVisualizationData as {
            xValues: number[] | string[]
            yValues: { data: number[]; label: string }[]
          }

          const chartConfig: any = {} satisfies ChartConfig;

          const chartData: any = []
          const dataKeys: string[] = []

          formattedLineData.yValues.map((value, index) => {
            dataKeys.push(value['label'])
            chartConfig[value['label']] = {
              label: value['label'],
              color: `hsl(var(--chart-${index + 1}))`
            }
          });

          formattedLineData.xValues.map((label, index) => {
            const currentItem: any = {}
            currentItem['xAxisDataKey'] = label;

            formattedLineData.yValues.map((value) => {
              currentItem[value['label']] = value['data'][index];
            });

            chartData.push(currentItem)
          })

          const lineChartData = {
            chartConfig: chartConfig,
            xAxisDataKey: 'xAxisDataKey',
            data: chartData,
            dataKeys: dataKeys
          } as LineChartData;

          formData.append('chart_type', ChartType.Line);
          formData.append('visualization_data', JSON.stringify(lineChartData));

          setVisualizationType(ChartType.Line);
          setVisualizationData(lineChartData);
        } else if (returnedVisualizationType == "pie") {
          const formattedPieData = formattedVisualizationData as {
            id: number
            value: number
            label: string
          }[]

          console.log(formattedPieData)

          const chartData: any = []

          const pieChartConfig: any = {
            sliceLabel: {
              label: "sliceLabel",
            },
          } satisfies ChartConfig

          formattedPieData.map((value, index) => {
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

          const pieChartData = {
            chartConfig: pieChartConfig,
            data: chartData,
            nameKey: 'sliceLabel',
            dataKey: 'value'
          } as PieChartData;

          formData.append('chart_type', ChartType.Pie);
          formData.append('visualization_data', JSON.stringify(pieChartData));

          setVisualizationType(ChartType.Pie);
          setVisualizationData(pieChartData);
        }
      } else {
        setVisualizationType(null);
        setVisualizationData(null);
      }
    }
  }

  async function regenerateInsight(chartType: string): Promise<boolean> {
    const visualizeFormData = new FormData();

    if (!insightFormData) {
      toast("Please reload the page and try again.");
      return false;
    }

    visualizeFormData.append('query', insightFormData!.get('kpi_description') as string);
    visualizeFormData.append('chart_type', chartType != "" ? chartType : insightFormData!.get('chart_type') as string)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visualize/regenerate`, {
      method: 'POST',
      body: visualizeFormData
    });

    if (res.status == 200) {
      const responseData = await res.json();

      if ("error" in responseData) {
        toast.error(responseData["error"]);
        return false;
      }

      const returnedVisualizationType = responseData["visualization"];

      if (returnedVisualizationType != "none") {
        const formattedVisualizationData = responseData['formatted_data_for_visualization']['formatted_data_for_visualization'];

        if ("explanation" in responseData) {
          setExplanation(responseData["explanation"])
        }

        if (returnedVisualizationType == "bar") {
          const formattedBarData = formattedVisualizationData as {
            labels: string[],
            values: { data: number[], label: string }[]
          }

          console.log(formattedBarData);

          const chartConfig: any = {} satisfies ChartConfig;

          const chartData: any = []
          const dataKeys: string[] = []

          formattedBarData.values.map((value, index) => {
            dataKeys.push(value['label'])
            chartConfig[value['label']] = {
              label: value['label'],
              color: `hsl(var(--chart-${index + 1}))`
            }
          });

          formattedBarData.labels.map((label, index) => {
            const currentItem: any = {}
            currentItem['xAxisDataKey'] = label;

            formattedBarData.values.map((value) => {
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

          if (insightFormData) {
            insightFormData.set('chart_type', ChartType.Bar);
            insightFormData.set('visualization_data', JSON.stringify(barChartData));

            setInsightFormData(insightFormData);
          }

          setVisualizationType(ChartType.Bar);
          setVisualizationData(barChartData);

          return true;
        } else if (returnedVisualizationType == "line") {
          const formattedLineData = formattedVisualizationData as {
            xValues: number[] | string[]
            yValues: { data: number[]; label: string }[]
          }

          const chartConfig: any = {} satisfies ChartConfig;

          const chartData: any = []
          const dataKeys: string[] = []

          formattedLineData.yValues.map((value, index) => {
            dataKeys.push(value['label'])
            chartConfig[value['label']] = {
              label: value['label'],
              color: `hsl(var(--chart-${index + 1}))`
            }
          });

          formattedLineData.xValues.map((label, index) => {
            const currentItem: any = {}
            currentItem['xAxisDataKey'] = label;

            formattedLineData.yValues.map((value) => {
              currentItem[value['label']] = value['data'][index];
            });

            chartData.push(currentItem)
          })

          const lineChartData = {
            chartConfig: chartConfig,
            xAxisDataKey: 'xAxisDataKey',
            data: chartData,
            dataKeys: dataKeys
          } as LineChartData;

          if (insightFormData) {
            insightFormData.append('chart_type', ChartType.Line);
            insightFormData.append('visualization_data', JSON.stringify(lineChartData));

            setInsightFormData(insightFormData);
          }

          setVisualizationType(ChartType.Line);
          setVisualizationData(lineChartData);

          return true;
        } else if (returnedVisualizationType == "pie") {
          const formattedPieData = formattedVisualizationData as {
            id: number
            value: number
            label: string
          }[]

          console.log(formattedPieData)

          const chartData: any = []

          const pieChartConfig: any = {
            sliceLabel: {
              label: "sliceLabel",
            },
          } satisfies ChartConfig

          formattedPieData.map((value, index) => {
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

          const pieChartData = {
            chartConfig: pieChartConfig,
            data: chartData,
            nameKey: 'sliceLabel',
            dataKey: 'value'
          } as PieChartData;

          if (insightFormData) {
            insightFormData.append('chart_type', ChartType.Pie);
            insightFormData.append('visualization_data', JSON.stringify(pieChartData));

            setInsightFormData(insightFormData);
          }

          setVisualizationType(ChartType.Pie);
          setVisualizationData(pieChartData);

          return true;
        } else {
          setVisualizationType(null);
          setVisualizationData(null);

          return false;
        }
      } else {
        setVisualizationType(null);
        setVisualizationData(null);

        return false;
      }
    }

    return false;
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
        <main
          className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          {isFormSubmitted && visualizationType && visualizationData ? <div className="px-3 pt-7 w-full max-w-sm items-center align-center min-h-0">
            <h1 className="pb-3.5 text-center text-3xl font-normal text-gray-800">Preview</h1>
            <div className="sm:px-4 py-3.5 flex flex-grow w-full">
              <Card className="h-83 w-full">
                <CardContent className="relative flex flex-grow px-3 py-3 h-full overflow-hidden w-full">
                  {
                    visualizationType == ChartType.Bar
                      ? <GBBarChart chartData={visualizationData as BarChartData} />
                      : visualizationType == ChartType.Line
                        ? <GBLineChart chartData={visualizationData as LineChartData} />
                        : visualizationType == ChartType.Pie
                          ? <GBPieChart chartData={visualizationData as PieChartData} />
                          : <div></div>
                  }
                  <div className="absolute flex flex-col gap-1.5 top-3 right-3">
                    {explanation && <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Info className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-xl">Explanation</DialogTitle>
                          <DialogDescription>
                            {
                              explanation
                            }
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    }
                    <Button variant="outline" size="icon" onClick={() => toast('Thanks for the feedback!')}>
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toast(<div>Experiencing an issue? Send us an <a
                      className="underline"
                      href={`mailto:cs3216-staff@googlegroups.com?body=I am having issues with project id:${params.projectid}`}>email</a>.
                    </div>)}>
                      <ThumbsDown className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="pt-3.5 pb-5 flex flex-cols gap-2 text-base text-gray-500 items-center justify-center">
              <RegenerateModal regenerateInsight={regenerateInsight} />
            </div>
            <div className="pb-7">
              <Button className="w-full" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </div> : <div className="px-3 pt-7 w-full max-w-sm items-center align-center min-h-0">
            <h1 className="pb-5 text-center text-3xl font-normal text-gray-800">Create a new insight</h1>
            <div className="sm:px-4 pt-5 pb-3 flex flex-grow w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Title</FormLabel>
                        <Input
                          type="text"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kpiDescription"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>KPI description</FormLabel>
                        <Textarea
                          className="h-28 resize-none"
                          {...field}
                        />
                        <FormMessage />
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
