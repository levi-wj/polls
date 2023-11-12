'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getSB } from '@/scripts/db';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await getSB().auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Check your email for the login link!');
    }
    setLoading(false);
  }

  return (
    <div className="bg-green-100 flex flex-col justify-center max-w-lg p-10 pt-10 pb-10" style={{height: "100svh"}}>
      <h1 className="text-3xl">Polls</h1>
      <p className="mb-5 text-gray-600">Measure public opinion</p>
      <form onSubmit={handleLogin} className="bg-green-200 p-3 rounded mb-5">
        <p className="text-gray-600">Sign up:</p>
        <div className="flex justify-between">
          <input
            className="flex-grow mr-1"
            type="email"
            placeholder="Your email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-primary" disabled={loading}>
            {loading ? <span>Loading</span> : <span>Send link</span>}
          </button>
        </div>
      </form>
      <div className="flex mb-5 gap-3">
        <Link href="#" className="text-gray-500">Contact</Link>
        <span className="text-gray-500 text-3xl leading-6">·</span>
        <Link href="#" className="text-gray-500">Github</Link>
      </div>
    </div>
  )
}