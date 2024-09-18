'use client'

import Login from "@/app/components/Login";

console.log(process.env);
export default function LoginPage() {
  return (
    <div className="flex h-screen bg-gray-100 justify-end h-full">
      <Login />
    </div>
  )
}