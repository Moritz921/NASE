import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <nav className="mt-2">
          <Link href="/admin" className="mr-4 hover:underline">Home</Link>
          <Link href="/admin/api/auth/signout" className="hover:underline">Logout</Link>
        </nav>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
