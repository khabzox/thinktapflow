import type React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { pageMetadata } from "@/constants/metadata";

export const metadata = pageMetadata.dashboard;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
