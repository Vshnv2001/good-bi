"use client"

import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff, LucideChevronLeft } from "lucide-react";
import { signIn } from "supertokens-web-js/recipe/emailpassword";
import { useEffect, useState } from "react";
import { doesSessionExist } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EyeClosedIcon } from "@radix-ui/react-icons";

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
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    doesSessionExist().then((hasSession) => {
      if (hasSession) {
        router.replace('/dashboard')
      }
    })
  }, [router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await signIn({
        formFields: [{
          id: "email",
          value: data.email
        }, {
          id: "password",
          value: data.password
        }]
      })

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach(formField => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax).
            window.alert(formField.error)
          }
        })
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        window.alert("Email password combination is incorrect.")
      } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
        // the reason string is a user friendly message
        // about what went wrong. It can also contain a support code which users
        // can tell you so you know why their sign in was not allowed.
        window.alert(response.reason)
      } else {
        // sign in successful. The session tokens are automatically handled by
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
        <LucideChevronLeft className="h-4.5 w-4.5"/>
        Back to GoodBI
      </Link>
      <div className="max-w-lg px-4 w-full place-self-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-4xl text-primary-500 font-extrabold font-logo w-fit mx-auto -mt-8"
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
                <FormItem className="space-y-1 relative">
                  <FormLabel className="font-normal text-base text-gray-800">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="rounded-xl text-base border border-gray-200/70 bg-white shadow-none pr-10 relative"
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-muted-foreground bottom-0 right-1 border-0 bg-transparent hover:bg-transparent z-50"
                      >
                        {showPassword ? <Eye className="size-[20px]" /> : <EyeOff className="size-[20px]" />}
                      </Button>
                    </div>
                  </FormControl>
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
