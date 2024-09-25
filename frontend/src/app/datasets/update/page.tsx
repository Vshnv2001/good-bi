"use client"

import SessionCheck from "@/app/components/SessionCheck";
import { NavBar } from "@/app/components/NavBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  datasetName: z.string().min(1, {
    message: "Please provide a dataset name."
  }),
  datasetDescription: z.string()
})

export default function EditDataset() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datasetName: "",
      datasetDescription: "",
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar/>
        <Breadcrumb className="mx-4 my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/datasets`}>Datasets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit dataset</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main
          className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto"
        >
          <h1 className="pb-3.5 text-center text-3xl font-normal text-gray-800">Edit dataset</h1>
          <div className="max-w-sm w-full px-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full mt-6">
                <FormField
                  control={form.control}
                  name="datasetName"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Dataset Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datasetDescription"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Dataset Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-28 resize-y"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  Edit dataset
                </Button>
              </form>
            </Form>
          </div>
        </main>
      </div>

    </SessionCheck>
  )
}