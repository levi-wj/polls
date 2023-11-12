import Link from "next/link";
import { getSB } from "@/scripts/db";

export default function Header() {
  return (
    <div className="bg-green-100 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div className="flex">
            <Link href="/" className="text-gray-700 hover:bg-emerald-200 px-5 py-3 rounded-md text-sm font-medium hover:no-underline">Home</Link>
            <Link href="/mine" className="text-gray-700 hover:bg-emerald-200 px-5 py-3 rounded-md text-sm font-medium hover:no-underline">My polls</Link>
            <Link href="/create" className="text-gray-700 hover:bg-emerald-200 px-5 py-3 rounded-md text-sm font-medium hover:no-underline">Create Poll</Link>
          </div>
          <div className="flex">
            <Link href="#" className="text-gray-700 hover:bg-emerald-200 px-5 py-3 rounded-md text-sm font-medium hover:no-underline" onClick={() => getSB().auth.signOut()}>Sign out</Link>
          </div>
        </div>
      </div>
    </div>
  );
}