'use client'

import { useState } from 'react';
import Link from 'next/link';
import { signUp } from 'supertokens-auth-react/recipe/emailpassword';
import { useRouter } from 'next/navigation';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
function SignupContent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // const response = await signUp({
      //   formFields: [
      //     { id: "email", value: email },
      //     { id: "password", value: password },
      //     { id: "first_name", value: firstName },
      //     { id: "last_name", value: lastName },
      //   ],
      // });
      const response = {
        status: "OK"
      }

      if (response.status === "OK") {
        router.push('/login');
      } else {
        // Log the entire response for debugging
        console.log('Sign up response:', response);
        setError(response.status);
      }
    } catch (err) {
      // Log the entire error object
      console.error('Sign up error:', err);
      setError('An error occurred during sign up. Please check the console for details.');
    }
  };

  return (
      <div className="bg-white p-8 shadow-md w-[50%]">
        <h1 className="text-3xl font-bold mb-6 text-center text-goodbi-pri">Sign Up</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block p-2 w-full rounded-md shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block p-2 text-black w-full rounded-md border-gray-300 shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block p-2 text-black w-full rounded-md border-gray-300 shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block p-2 text-black w-full rounded-md border-gray-300 shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-black font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block p-2 text-black w-full rounded-md border-gray-300 shadow-sm focus:border-goodbi-sec focus:ring focus:ring-goodbi-sec focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-goodbi-pri hover:bg-goodbi-sec focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-goodbi-sec"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
        <p className="mt-6 text-center text-sm text-goodbi-pri">
          Already have an account? <Link href="/login" className="text-goodbi-sec hover:text-goodbi-pri">Log in</Link>
        </p>
        </div>
      </div>
  );
}

export default function Signup() {
  return (
    <SignupContent />
  );
}
