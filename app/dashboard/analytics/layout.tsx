import { pageMetadata } from "@/constants/metadata";
export const metadata = pageMetadata.analytics;

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
