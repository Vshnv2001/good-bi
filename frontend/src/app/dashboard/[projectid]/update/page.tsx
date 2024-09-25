"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const FormSchema = z.object({
  name: z.string({
    required_error: "Please enter a project name.",
  }).min(1, "Please enter a project name.")
})

export default function UpdateProject({ params }: { params: { projectid: string } }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: ""
    },
    resolver: zodResolver(FormSchema),
  })

  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${params.projectid}`);

      if (res.status == 200) {
        const data = await res.json();

        reset({
          name: data.name
        });
      }
    }
    fetchProject()
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append('name', data.name)
    formData.append('project_id', params.projectid);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/update`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      const responseData = await res.json()
      toast("Project has been updated.")
      router.push('/dashboard');
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <Breadcrumb className="mx-4 my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit project</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
          <div className="px-4 pt-7 flex flex-col w-full max-w-sm gap-y-10 items-center align-center flex-grow min-h-0">
            <h1 className="text-center flex text-3xl font-normal text-gray-800">Edit project</h1>
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