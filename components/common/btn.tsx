import Link from "next/link";
import { Button } from "../ui/button";

const PrimaryBtn = ({ href, textContent, icon, className = "" }
    : {
        href: string,
        textContent: string,
        icon?: React.ReactNode,
        className?: string
    }) => {
    return (
        <Button variant="default" size="lg" asChild className={className}>
            <Link href={href} className="group">
                <span className="relative z-10">{textContent}</span>
                {icon && <span className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-150">{icon}</span>}
            </Link>
        </Button>
    )
}

const SecondaryBtn = ({ href, textContent, icon, className = "" }
    : {
        href: string,
        textContent: string,
        icon?: React.ReactNode,
        className?: string
    }) => {
    return (
        <Button variant="outline" size="lg" asChild className={className}>
            <Link href={href} className="group">
                <span className="relative z-10">{textContent}</span>
                {icon && <span className="relative z-10 group-hover:translate-x-1 transition-transform">{icon}</span>}
            </Link>
        </Button>
    )
}

const SuccessBtn = ({ href, textContent, icon, className = "" }
    : {
        href: string,
        textContent: string,
        icon?: React.ReactNode,
        className?: string
    }) => {
    return (
        <Button variant="success" size="lg" asChild className={className}>
            <Link href={href} className="group">
                <span className="relative z-10">{textContent}</span>
                {icon && <span className="relative z-10 group-hover:translate-x-1 transition-transform">{icon}</span>}
            </Link>
        </Button>
    )
}

const PremiumBtn = ({ href, textContent, icon, className = "" }
    : {
        href: string,
        textContent: string,
        icon?: React.ReactNode,
        className?: string
    }) => {
    return (
        <Button variant="premium" size="lg" asChild className={className}>
            <Link href={href} className="group relative overflow-hidden">
                <span className="relative z-10">{textContent}</span>
                {icon && <span className="relative z-10 group-hover:translate-x-1 transition-transform">{icon}</span>}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
        </Button>
    )
}

export { PrimaryBtn, SecondaryBtn, SuccessBtn, PremiumBtn };