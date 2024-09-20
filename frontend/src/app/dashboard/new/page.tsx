"use client";

import { ChevronRight, CalendarDays } from "lucide-react";

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

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

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
      from: z.date(),
      to: z.date(),
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

export default function Dashboard() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
      <NavBar />
      <div className="mx-4 my-2 flex flex-row gap-1 items-center">
        <span className="text-sm text-gray-500 font-normal">Dashboard</span>
        <ChevronRight className="text-gray-500 h-3 w-3" />
        <span className="text-sm text-gray-500 font-normal">New insight</span>
      </div>
      <main className="flex max-h-[calc(100vh_-_6.5rem)] flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
        <div className="px-4 pt-7 flex flex-col w-full max-w-sm gap-y-10 items-center align-center flex-grow min-h-0">
          <h1 className="text-center flex text-3xl font-normal text-gray-800">Create a new insight</h1>
          <div className="sm:px-3 pb-7 flex flex-grow w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
                <FormField
                  control={form.control}
                  name="dataset"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Dataset</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl>
                          <SelectTrigger className="px-3 py-4 rounded-xl text-base data-[placeholder]:text-gray-500 border border-gray-200/70 bg-white shadow-none">
                            <SelectValue className="" placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chartType"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Type of chart</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl>
                          <SelectTrigger className="px-3 py-4 rounded-xl text-base data-[placeholder]:text-gray-500 border border-gray-200/70 bg-white shadow-none">
                            <SelectValue className="" placeholder="Select chart type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="pie">Pie</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Date range</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="rounded-xl text-base border border-gray-200/70 bg-white shadow-none">
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 justify-start text-left font-normal",
                                !field.value.from && "text-muted-foreground"
                              )}
                            >
                              {field.value.from && (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              )}
                              <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: field.value.from,
                              to: field.value.to
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yRange"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Y range</FormLabel>
                      <Input
                        type="number"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
        </div>
      </main>
    </div>
  )
}
