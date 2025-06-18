import { pageMetadata } from '@/constants/metadata';
export const metadata = pageMetadata.generate;

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
    return { children };
}