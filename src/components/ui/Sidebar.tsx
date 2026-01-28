import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import SidebarItem from "./SidebarItem";
import { IoCalendar, IoCarSharp, IoCheckboxOutline, IoCodeWorking, IoListOutline, IoPerson } from "react-icons/io5";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LogOutButton } from "../auth/LogOutButton";

const menuItems = [
    {
        icon: <IoCalendar />,
        path: '/dashboard',
        title: 'Dashboard'
    },
    {
        icon: <IoCheckboxOutline />,
        path: '/dashboard/todos',
        title: 'Tareas'
    },
    {
        icon: <IoListOutline />,
        path: '/dashboard/server-todos',
        title: 'Server Actions'
    },
     {
        icon: <IoCodeWorking />,
        path: '/dashboard/cookies',
        title: 'Cookies'
    },
    {
        icon: <IoCarSharp />,
        path: '/dashboard/products',
        title: 'Productos'
    },
    {
        icon: <IoPerson />,
        path: '/dashboard/profile',
        title: 'Perfil'
    }
]


export default async function Sidebar() {

    const session = await getServerSession(authOptions); 
    
        if(!session){
            redirect('/api/auth/signin')
        }
    return (
        <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
            <div>
                <div className="-mx-6 px-6 py-4">
                    {/* TODO: Next/Link hacia dashboard */}
                    <Link href="/" title="home" className="rounded-lg">
                        {/* Next/Image */}
                        <Image src={session.user?.image || ''} width={100} height={100}  className="rounded-lg"  alt="tailus logo" />
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    {/* Next/Image */}
                    <img src="https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp" alt="" className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28" />
                    <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">{session.user?.name}</h5>
                    <span className="hidden text-gray-400 lg:block">{session.user?.email}</span>
                    <span className="hidden text-gray-400 lg:block">{session.user?.roles?.join(', ')}</span>

                </div>

                <ul className="space-y-2 tracking-wide mt-8">

                    {menuItems.map((item) => (
                        <SidebarItem key={item.path} {...item} />
                    ))}

                </ul>
            </div>

            <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
                <LogOutButton/>
            </div>
        </aside>

    )
}
