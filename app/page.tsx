"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StorageService } from "./services/storage";
import Welcome from "./components/Welcome";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const businesses = StorageService.getBusinesses();
    const currentId = StorageService.getCurrentBusinessId();

    if (currentId && businesses.length > 0) {
      // If there's a current business, redirect to dashboard
      router.push("/dashboard");
    } else if (businesses.length > 0) {
      // If there are businesses but no current one, set the first one and redirect
      StorageService.setCurrentBusinessId(businesses[0].id);
      router.push("/dashboard");
    }
    // If no businesses exist, stay on welcome page
  }, [router]);

  // Show welcome page
  return <Welcome onBusinessCreated={() => router.push("/dashboard")} />;
}
