'use client'

import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface LayoutProps {
    children: React.ReactNode
}

interface MenuProps {
    children: React.ReactNode;
    link: string;
}

const Menu = (props: MenuProps) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(props.link);

    return (
        <Link href={props.link} className={`group nav text-xl text-primary ${isActive ? "font-semibold" : ""} hover:font-semibold`}>
            <div>{props.children}</div>
            <div className={`garis bg-primary h-[1px] w-[85%] m-auto ${isActive ? "block" : "hidden"} group-hover:block`}></div>
        </Link>
    );
}

const Layout = (props: LayoutProps) => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50); 
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const colorMap: Record<string, string> = {
        '/beranda': 'bg-primary-600',
        '/berita': 'bg-white',
        '/galeri': 'bg-white',
        '/login': 'bg-primary-900',
    };

    const navBgColor = scrolled ? 'bg-primary-600' : (colorMap[pathname] || 'bg-primary-600');
    return (
        <div>
            <nav className={`py-5 fixed top-0 w-full z-50 ${navBgColor} transition-colors duration-300`}>
                <div className="wrap flex justify-between items-center container mx-auto">
                    <div className="left flex items-center gap-2">
                        <div className="logo">
                            <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[65px]' />
                        </div>
                        <div className="teks">
                            <div className="head font-bold text-3xl text-primary">SITANI</div>
                            <div className="head text-base">Sistem Informasi Data Pertanian Lampung Timur</div>
                        </div>
                    </div>
                    <div className="menu flex items-center gap-5">
                        <Menu link="/beranda">Beranda</Menu>
                        <Menu link="/berita">Berita</Menu>
                        <Menu link="/galeri">Galeri</Menu>
                        <Menu link="#">Data</Menu>
                        <Link href="/login" className='text-xl p-2 px-10 rounded-full bg-primary text-white'> Login</Link>
                    </div>
                </div>
            </nav>
            <div>
                {props.children}
            </div>
            <footer className='bg-primary py-5'>
                <div className="container mx-auto wrap text-white">
                    Copyrigt &copy; 2024 <span className='font-semibold'>SITANI LAMPUNG TIMUR.</span> All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Layout;
