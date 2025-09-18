"use client";

import { getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
    type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };

  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Bitte anmelden
        </h1>
        {providers &&
          Object.values(providers).map((provider: Provider) => (
            <div key={provider.name} className="mb-4">
              <form action={`/api/auth/signin/${provider.id}`} method="POST">
                <input
                  type="hidden"
                  name="csrfToken"
                  value={"" /* automatic NextAuth injection */}
                />
                <input
                  type="hidden"
                  name="callbackUrl"
                  value="/admin"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border rounded-lg bg-white hover:bg-gray-100 transition"
                >
                  <span>Sign in with {provider.name}</span>
                </button>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
}
