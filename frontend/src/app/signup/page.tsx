"use client"

import Link from "next/link";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucideChevronLeft } from "lucide-react";
import { signUp } from "supertokens-web-js/recipe/emailpassword";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doesSessionExist } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  email: z
    .string()
    .min(1, { message: "Please enter an email." })
    .email({ message: "Invalid email." }),
  password: z
    .string()
    .min(1, { message: "Please enter a password." }),
})

export default function Signup() {
  const router = useRouter()

  useEffect(() => {
    doesSessionExist().then((hasSession) => {
      if (hasSession) {
        router.replace('/dashboard')
      }
    })
  }, [router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
    try {
      const response = await signUp({
          formFields: [{
              id: "email",
              value: data.email
          }, {
              id: "password",
              value: data.password
          }]
      })

      if (response.status === "FIELD_ERROR") {
          // one of the input formFields failed validation
          response.formFields.forEach(formField => {
              if (formField.id === "email") {
                  // Email validation failed (for example incorrect email syntax),
                  // or the email is not unique.
                  window.alert(formField.error)
              } else if (formField.id === "password") {
                  // Password validation failed.
                  // Maybe it didn't match the password strength
                  window.alert(formField.error)
              }
          })
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
          // the reason string is a user friendly message
          // about what went wrong. It can also contain a support code which users
          // can tell you so you know why their sign up was not allowed.
          window.alert(response.reason)
      } else {
          // sign up successful. The session tokens are automatically handled by
          // the frontend SDK.
          window.location.href = "/dashboard"
      }
  } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          window.alert(err.message);
      } else {
          window.alert("Oops! Something went wrong.");
      }
  }
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
          className="flex items-center gap-2 text-4xl text-primary-500 font-logo font-extrabold w-fit mx-auto"
        >
          <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-12 w-10" width="28" height="28"/>
          GoodBI
          <span className="sr-only">GoodBI</span>
        </Link>
        <h1 className="font-bold text-2xl text-center mt-4 tracking-tight md:text-3xl">Join the ultimate AI business intelligence platform.</h1>
        <p className="mt-2 text-center text-gray-500">
          Already have an account? {" "}
          <Link className="transition-colors duration-100 text-primary-700 hover:text-primary-500" href="/login">
            Login
          </Link>
          .
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm mx-auto flex flex-col gap-y-5 w-full mt-8">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-normal text-base text-gray-800">Name</FormLabel>
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
              Sign up
            </Button>
          </form>
        </Form>
        <p className="mt-8 text-center text-sm text-gray-500 max-w-64 mx-auto">
          By proceeding, you agree to our{" "}
          <Link href="/privacy-policy" target="_blank"
                className="underline transition-colors duration-100 hover:text-gray-700">
            Privacy Policy
          </Link>
          {' '}and{' '}
          <Link href="/terms-of-service" target="_blank"
                className="underline transition-colors duration-100 hover:text-gray-700">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
