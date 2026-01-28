"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { IoLogIn, IoShieldOutline } from "react-icons/io5";



export const LogOutButton = () => {

    const {data: session, status} = useSession();

    if(status === 'loading'){
        return (
            <p className="flex items-center gap-4">
                <IoShieldOutline/>
                <span>Espere...</span>
            </p>
        )
    }

     if(status === 'unauthenticated'){
        return (
            <button onClick={() => signIn()} className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
                <IoLogIn/>
                <span>Ingresar</span>
            </button>
        )
    }

    return (
        <button onClick={() => signOut()} className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
            <CiLogout />
            <span className="group-hover:text-gray-700">Logout</span>
        </button>
    )
}
