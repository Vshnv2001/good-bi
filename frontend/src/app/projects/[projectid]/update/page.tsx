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

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import axios from 'axios';

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import SessionCheck from "@/app/components/SessionCheck";

const FormSchema = z.object({
  name: z.string({
    required_error: "Please enter a project name.",
  })
})

export default function UpdateProject({ params }: { params: { projectid: string } }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {

    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let formData = new FormData();
    formData.append('name', data.name)
    formData.append('project_id', params.projectid);
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/update`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      let responseData = await res.json()
      window.location.href = '/projects'
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <div className="mx-4 my-2 flex flex-row gap-1 items-center">
          <span className="text-sm text-gray-500 font-normal">Project</span>
          <ChevronRight className="text-gray-500 h-3 w-3" />
          <span className="text-sm text-gray-500 font-normal">Edit project</span>
        </div>
        <main className="flex max-h-[calc(100vh_-_6.5rem)] flex-1 flex-col bg-gray-100 mx-4 rounded-2xl border border-gray-200/70 items-center justify-center overflow-y-auto">
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
