import { pageMetadata } from "@/constants/metadata";
export const metadata = pageMetadata.login;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
