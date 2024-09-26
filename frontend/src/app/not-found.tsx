import Link from 'next/link'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EmojiConfetti from "@/app/components/Landing/EmojiConfetti";

export default function NotFound() {
  return (
    <div className="h-svh bg-gray-50 grid place-content-center text-gray-800">
      <div className="max-w-sm mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-4xl text-primary-500 font-logo font-extrabold w-fit mx-auto -mt-8"
        >
          <Image src={`/icons/goodbi-logo.svg`} alt="GoodBI" className="h-12 w-10" width="28" height="28"/>
          GoodBI
          <span className="sr-only">GoodBI</span>
        </Link>
        <h1 className="text-center font-bold text-4xl mt-12">
          <EmojiConfetti confettiText="Congratulations">, you&apos;re lost</EmojiConfetti>
        </h1>
        <p className="mt-2 text-center">Could not find the requested page.</p>
        <Button className="my-8 mx-auto w-full" asChild>
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    </div>
  )
}
