"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

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

const FormSchema = z.object({
  name: z.string({
    required_error: "Please enter a project name.",
  })
})

export default function NewProject() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {

    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let formData = new FormData();
    formData.append('name', data.name)
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/new`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      let responseData = await res.json()
      router.push('/projects');
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <Breadcrumb className="mx-4 my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Project</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New project</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          <div className="px-4 pt-7 flex flex-col w-full max-w-sm gap-y-10 items-center align-center flex-grow min-h-0">
            <h1 className="text-center flex text-3xl font-normal text-gray-800">Create a new project</h1>
            <div className="sm:px-3 pb-7 flex flex-grow w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Name</FormLabel>
                        <Input
                          type="text"
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
    </SessionCheck>
  )
}
