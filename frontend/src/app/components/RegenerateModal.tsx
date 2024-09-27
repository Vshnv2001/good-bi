"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { boolean, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { ReactNode, useState } from "react";

const formSchema = z.object({
  chartType: z.string(),
})

export default function RegenerateModal({regenerateInsight, children}: { regenerateInsight: (chartType: string) => Promise<boolean>, children?: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chartType: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const isRegenerationSuccessful = await regenerateInsight(values.chartType);

    console.log(isRegenerationSuccessful);

    if (isRegenerationSuccessful) {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex gap-1.5 items-center">
          {children ? children : <><RotateCw className="size-4"/>Regenerate</>}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Regenerate insights</DialogTitle>
          <DialogDescription>
            Input additional settings to finetune the generated insight. Leave the field empty if you want us to choose
            the best option for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="chartType"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Chart Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chart type"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="pie">Pie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Specify a particular chart type to generate.</FormDescription>
                </FormItem>
              )}
            >
            </FormField>
            <Button type="submit" className="w-full">
              <RotateCw className="size-4 mr-1.5"/>
              Regenerate
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}