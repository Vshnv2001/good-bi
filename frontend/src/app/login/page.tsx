"use client"

import Link from "next/link";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {LucideChevronLeft} from "lucide-react";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email." })
    .email({ message: "Invalid email." }),
  password: z
    .string()
    .min(1, { message: "Please enter a password." }),
})

export default function Login() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <main className="min-h-[600px] h-svh bg-gray-100 grid w-full">
      <Link
        href="/"
        className={`fixed top-4 left-4 sm:top-12 sm:left-12 inline-flex items-center gap-1 text-gray-500
                    transition-colors duration-100 hover:text-primary-700`
        }
      >
        <LucideChevronLeft className="h-4.5 w-4.5" />
        Back to GoodBI
      </Link>
      <div className="max-w-lg px-4 w-full place-self-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-4xl text-primary-500 font-extrabold w-fit mx-auto -mt-8"
        >
          <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-12 w-10" width="28" height="28"/>
          GoodBI
          <span className="sr-only">GoodBI</span>
        </Link>
        <h1 className="font-bold tracking-tight text-3xl text-center mt-4">Welcome back!</h1>
        <p className="mt-2 text-center text-gray-500">
          New here?{' '}
          <Link className="transition-colors duration-100 text-primary-700 hover:text-primary-500" href="/signup">
            Sign up
          </Link>
          .
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm mx-auto flex flex-col gap-y-5 w-full mt-8">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-normal text-base text-gray-800">Email</FormLabel>
                  <Input
                    type="text"
                    className="rounded-xl text-base border border-gray-200/70 bg-white shadow-none"
                    {...field}
                  />
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-normal text-base text-gray-800">Password</FormLabel>
                  <Input
                    type="password"
                    className="rounded-xl text-base border border-gray-200/70 bg-white shadow-none"
                    {...field}
                  />
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit">
              Login
            </Button>
          </form>
        </Form>
        <p className="mt-8 text-center text-sm text-gray-500 max-w-64 mx-auto">
          By proceeding, you agree to our{" "}
          <Link href="/privacy-policy" target="_blank" className="underline transition-colors duration-100 hover:text-gray-700">
            Privacy Policy
          </Link>
          {' '}and{' '}
          <Link href="/terms-of-service" target="_blank" className="underline transition-colors duration-100 hover:text-gray-700">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
