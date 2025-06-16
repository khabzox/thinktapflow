import Link from "next/link";
import { Button } from "../ui/button";

const PrimaryBtn = ({ href, textContent, icon }
    : {
        href: string,
        textContent: string,
        icon?: React.ReactNode
    }) => {
    return (
        <Button variant="primary" asChild>
            <Link href={href}>
                {textContent}
                {icon}
            </Link>
        </Button>
    )
}

const SecondaryBtn = ({ href, textContent, icon }
    : {
        href: string,
        textContent: string,
        icon?: React.ReactNode
    }) => {
    return (
        <Button variant="secondary" asChild>
            <Link href={href}>
                {textContent}
                {icon}
            </Link>
        </Button>
    )
}


export { PrimaryBtn, SecondaryBtn };