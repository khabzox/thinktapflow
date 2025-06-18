import { pageMetadata } from '@/constants/metadata';
export const metadata = pageMetadata['verify-email'];

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
    return (
        {children}
    );
}