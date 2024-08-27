import React from 'react'
import { usePathname } from 'next/navigation';


const BerandaIcon = () => {
    const pathname = usePathname();

    return (
        <svg className={`${pathname.startsWith("/beranda") ? "stroke-primary" : "stroke-black"}`} width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.48657 9.39925L10.9999 2L20.5132 9.39925V21.0266C20.5132 21.5873 20.2905 22.125 19.894 22.5215C19.4975 22.918 18.9598 23.1407 18.3991 23.1407H3.60064C3.03996 23.1407 2.50223 22.918 2.10577 22.5215C1.7093 22.125 1.48657 21.5873 1.48657 21.0266V9.39925Z" strokeWidth="2.11407" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.82861 23.1407V12.5704H14.1708V23.1407" strokeWidth="2.11407" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default BerandaIcon