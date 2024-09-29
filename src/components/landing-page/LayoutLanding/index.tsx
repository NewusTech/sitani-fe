'use client'

import NavMobile from '@/components/landing-page/NavMobile';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

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

    const navBgColor = scrolled ? 'bg-primary-600/60' : (colorMap[pathname] || 'bg-primary-600');
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='min-h-screen flex flex-col'>
            {/* nav mobile */}
            <div className="nav mobile md:hidden bg-primary-600">
                <div className="left container mx-auto py-2 flex items-center gap-2 justify-center">
                    <div className="logo">
                        <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[50px]' />
                    </div>
                    <div className="teks">
                        <div className="head font-bold text-xl md:text-3xl text-primary animate-pulse transition-all">SITANI</div>
                        <div className="head text-sm md:text-base">Sistem Informasi Data Pertanian Lampung Timur</div>
                    </div>
                </div>
            </div>
            {/* nav mobile */}
            <nav className={`py-3 hidden md:block fixed top-0 w-full z-50 ${navBgColor} transition-colors duration-300`}>
                <div className="wrap flex justify-between items-center container mx-auto">
                    <div className="left flex items-center gap-2">
                        <div className="logo">
                            <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[55px]' />
                        </div>
                        <div className="teks">
                            <div className="head font-bold text-3xl text-primary animate-pulse transition-all">SITANI</div>
                            <div className="head text-base">Sistem Informasi Data Pertanian Lampung Timur</div>
                        </div>
                    </div>
                    <div className="menu flex items-center gap-5">
                        <Menu link="/beranda">Beranda</Menu>
                        <Menu link="/berita">Berita</Menu>
                        <Menu link="/galeri">Galeri</Menu>
                        <Menu link="#">
                            <Popover
                                onOpenChange={(open) => setIsOpen(open)} // Mengubah state berdasarkan status Popover
                            >
                                <PopoverTrigger>
                                    Data
                                    {isOpen ? (
                                        <ChevronUpIcon className="h-5 w-5 inline-block ml-2 animate-bounce" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5 inline-block ml-2" />
                                    )}
                                </PopoverTrigger>
                                <PopoverContent className="shadow-lg w-[60%] border-primary border-double border-4 opacity-90 p-0 rounded-lg">
                                    <Link href={"/data/harga-produsen-dan-eceran"} className={`opacity-1`}>
                                        <div className={`p-4 transition-all ease-in-out duration-300 ${pathname === "/data/harga-produsen-dan-eceran"
                                            ? "bg-primary text-white font-semibold shadow-xl scale-100"  // Active link styles
                                            : "hover:bg-primary hover:text-white text-primary font-semibold hover:shadow-xl hover:scale-105"}  // Hover effect for inactive link
        rounded-lg`}>
                                            Daftar Harga Produsen <br /> dan Eceran
                                        </div>
                                    </Link>
                                    <Link href={"/data/koefisien-variasi-produksi"} className={`opacity-1`}>
                                        <div className={`p-4 transition-all ease-in-out duration-300 ${pathname === "/data/koefisien-variasi-produksi"
                                            ? "bg-primary text-white font-semibold shadow-xl scale-100"  // Active link styles
                                            : "hover:bg-primary hover:text-white text-primary font-semibold hover:shadow-xl hover:scale-105"}  // Hover effect for inactive link
        rounded-lg`}>
                                            Data Coefesien Variansi (CV) Tk. Produksi
                                        </div>
                                    </Link>
                                    <Link href={"/data/koefisien-variasi-produsen"} className={`opacity-1`}>
                                        <div className={`p-4 transition-all ease-in-out duration-300 ${pathname === "/data/koefisien-variasi-produsen"
                                            ? "bg-primary text-white font-semibold shadow-xl scale-100"  // Active link styles
                                            : "hover:bg-primary hover:text-white text-primary font-semibold hover:shadow-xl hover:scale-105"}  // Hover effect for inactive link
        rounded-lg`}>
                                            Data Coefesien Variansi (CV) Tk. Produsen
                                        </div>
                                    </Link>
                                    <Link href={"/data/perbandingan-komoditas-harga-panen"} className={`opacity-1`}>
                                        <div className={`p-4 transition-all ease-in-out duration-300 ${pathname === "/data/perbandingan-komoditas-harga-panen"
                                            ? "bg-primary text-white font-semibold shadow-xl scale-100"  // Active link styles
                                            : "hover:bg-primary hover:text-white text-primary font-semibold hover:shadow-xl hover:scale-105"}  // Hover effect for inactive link
        rounded-lg`}>
                                            Perbandingan Komoditas Harga Pangan Tingkat Pedagang Eceran
                                        </div>
                                    </Link>
                                </PopoverContent>
                            </Popover>
                        </Menu>
                        <Link href="/login" className='text-xl p-2 px-10 rounded-full bg-primary text-white'>Login</Link>
                    </div>
                </div>
            </nav>
            <div className="flex-grow">
                {props.children}
            </div>
            <footer className='bg-primary md:block hidden py-5'>
                <div className="container mx-auto wrap text-white animate-pulse transition-all">
                    Copyrigt &copy; 2024 <span className='font-semibold'>SITANI LAMPUNG TIMUR.</span> All rights reserved.
                </div>
            </footer>
            <NavMobile />
        </div>
    );
}

export default Layout;
