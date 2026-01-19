
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";


interface Props {
    icon: React.ReactNode,
    path: string,
    title: string
}

export default function SidebarItem({path, title, icon}: Props) {

    const pathname = usePathname(); 

    return (
        <li>
            <Link href={path} className={
                `relative px-4 py-3 flex items-center space-x-4 rounded-xl text-white bg-gradient-to-r from-sky-600 to-cyan-400
                ${path === pathname ? 'text-white bg-gradient-to-r from-sky-600 to-cyan-400 ' : ''}
                `
            }>
               {icon}
                <span className="-mr-1 font-medium group-hover:text-gray-700">{title}</span>
            </Link>
        </li>
    )
}
