'use client'

import NavMobile from '@/components/landing-page/NavMobile';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { NavigationMenu, NavigationMenuList } from '@radix-ui/react-navigation-menu';
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
        <div>
            <div className="nav mobile md:hidden bg-primary-600">
                <div className="left container mx-auto py-2 flex items-center gap-2 justify-center">
                    <div className="logo">
                        <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[50px]' />
                    </div>
                    <div className="teks">
                        <div className="head font-bold text-xl md:text-3xl text-primary">SITANI</div>
                        <div className="head text-sm md:text-base">Sistem Informasi Data Pertanian Lampung Timur</div>
                    </div>
                </div>
            </div>
            <nav className={`py-3 hidden md:block fixed top-0 w-full z-50 ${navBgColor} transition-colors duration-300`}>
                <div className="wrap flex justify-between items-center container mx-auto">
                    <div className="left flex items-center gap-2">
                        <div className="logo">
                            <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[55px]' />
                        </div>
                        <div className="teks">
                            <div className="head font-bold text-3xl text-primary">SITANI</div>
                            <div className="head text-base">Sistem Informasi Data Pertanian Lampung Timur</div>
                        </div>
                    </div>
                    <div className="menu flex items-center gap-5">
                        <Menu link="/">Beranda</Menu>
                        <Menu link="/berita">Berita</Menu>
                        <Menu link="/galeri">Galeri</Menu>
                        {/* <Menu link="#">Data</Menu> */}
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
                                <PopoverContent className="shadow-lg w-[60%] border-primary border-double border-4 opacity-90 p-0">
                                    <Link href={"/data/harga-produsen-dan-eceran"} className="opacity-1">
                                        <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold text-primary">
                                            Daftar harga produsen
                                            dan eceran
                                        </div>
                                    </Link>
                                    <Link href={"/data/koefisien-variasi-produksi"} className="opacity-1">
                                        <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold text-primary">
                                            Koefesian variasi tingkat
                                            produksi
                                        </div>
                                    </Link>
                                    <Link href={"/data/koefisien-variasi-produsen"} className="opacity-1">
                                        <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold text-primary">
                                            Koefesian variasi tingkat
                                            produsen
                                        </div>
                                    </Link>
                                    <Link href={"/data/perbandingan-komoditas-harga-panen"} className="opacity-1">
                                        <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold text-primary">
                                            Perbandingan komoditas
                                            harga panen tingkat
                                            eceran
                                        </div>
                                    </Link>
                                </PopoverContent>
                            </Popover>
                        </Menu>
                        <Link href="/login" className='text-xl p-2 px-10 rounded-full bg-primary text-white'>Login</Link>
                    </div>
                </div>
            </nav>

            <div>
                {props.children}
            </div>
            <footer className='bg-primary md:block hidden py-5'>
                <div className="container mx-auto wrap text-white">
                    Copyrigt &copy; 2024 <span className='font-semibold'>SITANI LAMPUNG TIMUR.</span> All rights reserved.
                </div>
            </footer>
            <NavMobile />
        </div>
    );
}

export default Layout;
