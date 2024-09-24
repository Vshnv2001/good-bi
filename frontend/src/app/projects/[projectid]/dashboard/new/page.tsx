"use client";

import {ChevronRight, CalendarDays} from "lucide-react";

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
import {Textarea} from "@/components/ui/textarea"

import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

export default function NewDashboard({params}: { params: { projectid: string } }) {
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
    let formData = new FormData();

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
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights/new`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      let responseData = await res.json()
      window.location.href = `/projects/${params.projectid}/dashboard`
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar/>
        <div className="mx-4 my-2 flex flex-row gap-1 items-center">
          <span className="text-sm text-gray-500 font-normal">Dashboard</span>
          <ChevronRight className="text-gray-500 h-3 w-3"/>
          <span className="text-sm text-gray-500 font-normal">New insight</span>
        </div>
        <main
          className="flex max-h-[calc(100vh_-_6.5rem)] flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          <div className="px-3 pt-7 flex flex-col w-full max-w-sm items-center align-center flex-grow min-h-0">
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
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
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
                    name="yRange"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Y range</FormLabel>
                        <Input
                          type="number"
                          {...field}
                        />
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
          </div>
        </main>
      </div>
    </SessionCheck>
  )
}
