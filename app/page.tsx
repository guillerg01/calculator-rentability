"use client";

import { useEffect, useState } from "react";
import { StorageService } from "./services/storage";
import Welcome from "./components/Welcome";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // // Show loading or welcome page
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Cargando...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Welcome onBusinessCreated={() => (window.location.href = "/dashboard")} />
  );
}
