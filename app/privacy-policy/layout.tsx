import { pageMetadata } from '@/constants/metadata';
export const metadata = pageMetadata['privacy-policy'];

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}