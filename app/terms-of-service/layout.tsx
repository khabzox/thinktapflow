import { pageMetadata } from "@/constants/metadata";
export const metadata = pageMetadata["terms-of-service"];

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
