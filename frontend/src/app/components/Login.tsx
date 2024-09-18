'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      router.push('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="bg-white w-[50%] p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-goodbi-pri">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block text-black p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-goodbi-pri hover:bg-goodbi-sec focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-goodbi-sec"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-goodbi-pri">
          Don't have an account? <Link href="/signup" className="text-goodbi-sec hover:text-goodbi-pri">Sign up</Link>
        </p>
      </div>
  );
}
