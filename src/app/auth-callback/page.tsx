"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error, isSuccess, isError, isLoading } =
    trpc.authCallback.useQuery(undefined, {
      retry: true,
      retryDelay: 500,
    });

  useEffect(() => {
    // Handle success state
    if (isSuccess && data.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }

    // Handle error state
    if (isError && error.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    }
  }, [isSuccess, data, isError, error, origin, router]);

  // Loading UI
  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="font-semibold text-xl">Setting up your account...</h3>
          <p>You will be redirected automatically</p>
        </div>
      </div>
    );
  }

  // Fallback in case something goes wrong
  return null;
};

export default Page;
