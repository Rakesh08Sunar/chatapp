
import Link  from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className='text-2xl font-bold'>Welcome To Chat App</h1>
      <div className="mt-6">
      <Link href="/login" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Login </Link>
      <Link href="/register" className="ml-4 mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">Register</Link>
      </div>
    </div>
  );
}
