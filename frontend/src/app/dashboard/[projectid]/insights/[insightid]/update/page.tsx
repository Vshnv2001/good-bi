"use client";

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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import SessionCheck from "@/app/components/SessionCheck";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FormSchema = z.object({
  title: z.string({
    required_error: "Please enter an insight title.",
  }).min(1, "Please enter an insight title.")
})

export default function UpdateInsight({ params }: { params: { projectid: string, insightid: string } }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      title: ""
    },
    resolver: zodResolver(FormSchema),
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    async function fetchInsight() {
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insight/${params.insightid}`);

      if (res.status == 200) {
        let data = await res.json();

        reset({
          title: data.title
        });
      }
    }
    fetchInsight()
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let formData = new FormData();
    formData.append('title', data.title)
    formData.append('insight_id', params.insightid)
    formData.append('project_id', params.projectid);
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights/update`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      let responseData = await res.json()
      router.push(`/dashboard`);
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
              <BreadcrumbPage>Edit insight</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          <div className="px-4 pt-7 flex flex-col w-full max-w-sm gap-y-10 items-center align-center flex-grow min-h-0">
            <h1 className="text-center flex text-3xl font-normal text-gray-800">Edit insight</h1>
            <div className="sm:px-3 pb-7 flex flex-grow w-full">
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
                  <Button type="submit">
                    Save
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>
      </div>
    </SessionCheck>
  )
}
