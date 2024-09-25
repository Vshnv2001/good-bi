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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomCombobox } from "@/components/ui/customCombobox";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  datasetName: z.string().min(1, {
    message: "Please provide a dataset name."
  }),
  datasetDescription: z.string(),
  datasetFile: z.instanceof(File, {
    message: 'Please provide a CSV file.'
  }).refine((file) => file.size > 0, {
    message: 'File must not be empty.'
  })
})

export default function NewDataset() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datasetName: "",
      datasetDescription: "",
    }
  })

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      file_id: uuidv4()
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        toast('Added new data')
        router.push('/datasets');
      } else {
        toast.error('Failed to submit dataset');
      }
    } catch (error) {
      toast.error('Error submitting dataset');
    }
  }

  const [options, setOptions] = useState<{
    label: string,
    value: string
  }[]>([])

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);

      if (res.status == 200) {
        return res.json();
      }
    }

    fetchProject().then((res) => {
      setOptions(res.data.map((r: { datasetName: string }) => {
        return {
          label: r.datasetName,
          value: r.datasetName
        }
      }))
    })
  }, []);

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
              <BreadcrumbPage>New dataset</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main
          className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto"
        >
          <h1 className="pb-3.5 text-center text-3xl font-normal text-gray-800">Create new dataset</h1>
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
                        <CustomCombobox
                          className="w-full"
                          options={options}
                          mode="single"
                          onChange={(value) => form.setValue("datasetName", typeof value === 'string' ? value : value.join(''))}
                          onCreate={(value) => {
                            setOptions(options.concat({
                              label: value, value: value
                            }))
                            form.setValue("datasetName", value)
                          }}
                          selected={field.value}
                          placeholder="Select dataset"
                        />
                      </FormControl>
                      <FormMessage/>
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
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datasetFile"
                  render={({field: {value, onChange, ...fieldProps}}) => (
                    <FormItem>
                      <FormLabel>CSV file</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="text/csv"
                          onChange={(event) =>
                            onChange(event.target.files && event.target.files[0])
                          }
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  Create dataset
                </Button>
              </form>
            </Form>
          </div>
        </main>
      </div>

    </SessionCheck>
  )
}