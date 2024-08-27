"use client"

import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import Dashboard from '../../../public/icons/Dashboard';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


interface LayoutAdminProps {
    children: React.ReactNode;
    title?: string;
}

interface MenuProps {
    icons?: React.ReactNode;
    children: React.ReactNode;
    title?: string;
    link: string;
}

const Menu = (props: MenuProps) => {
    const pathname = usePathname();

    return (
        <Link href={props.link} className={`nav flex items-center gap-4 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(props.link) ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
            <div className="icon">
                {props.icons}
            </div>
            <div className={`nama text-[18px] ${pathname.startsWith(props.link) ? "text-white" : "text-primary"}`}>{props.children}</div>
        </Link>
    )
}

const LayoutAdmin = (props: LayoutAdminProps) => {
    const [navbar, setNavbar] = useState(false);

    const pathname = usePathname();
    const isProdukActive = pathname.startsWith('/admin/cms/kategori') || pathname.startsWith('/admin/cms/unit');
    const [produk, setProduk] = useState(isProdukActive);

    const handleProduk = () => {
        setProduk(!produk);
    }
    const handleNavbar = () => {
        setNavbar(!navbar);
    }
    return (
        <div className="wrap w-full min-h-screen bg-white relative">
            {/* navbar */}
            <div className="navatas lg:px-0 z-10 top-0 w-full md:w-full right-0 fixed bg-white">
                <div className="wra white md:ml-[290px]  bg-white   m-auto justify-between lg:justify-end py-[23px]  flex items-center gap-4">
                    <div onClick={handleNavbar} className="icon block cursor-pointer lg:hidden ">
                        {navbar ? "x" : "="}
                    </div>
                    <div className="nav-wrap w-full flex justify-between">
                        <div className="header  flex flex-col">
                            <div className="text-3xl font-semibold text-primary uppercase">{props.title || "Title"}</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* sidebar */}
            <div className={`sidebar bg-[#F6F6F6] pt-[70px] lg:pt-0 z-[1] lg:z-20 lg:block h-screen fixed top-0 ${navbar ? "left-[0%]" : "left-[-100%]"} box-border lg:w-[250px] lg:shadow-none shadow-lg w-[70%] px-[30px] bg-whie transition-all duration-300 lg:left-0 `}>
                <div className="LOGO flex my-10 gap-2 items-center ">
                    <div className="logo flex-shrink-0 ">
                        <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[50px]' />
                    </div>
                    <div className="teks flex-shrink-0 text-primary">
                        <div className="head font-bold text-2xl text-primary">SITANI</div>
                        <div className="head text-base ">Super Admin</div>
                    </div>
                </div>
                <div className="wrap-nav flex bg-red flex-col gap-2 h-[73%]">
                    <div className="wrap flex flex-col gap-1">
                        <Menu icons={<Dashboard />} link="/kepegawaian">Dashboard</Menu>
                        <div className='h-[73%] overflow-auto'>
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className='text-left'>
                                        Ketahanan Pangan
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Menu link="/admin/cms/laporan">
                                            <span className='text-sm'>Sub Bab1</span></Menu>
                                        <Menu link="/admin/cms/laporan">
                                            <span className='text-sm'>Sub Bab2</span></Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className='text-left'>
                                        Tanaman Pangan dan Holtikulturan
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Menu link="/admin/cms/laporan"><span className='text-sm'>Laporan</span></Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className='text-left'>
                                        Penyuluhan
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Menu link="/admin/cms/laporan"><span className='text-sm'>Laporan</span></Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className='text-left'>
                                        PSP
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Menu link="/admin/cms/laporan"><span className='text-sm'>Laporan</span></Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className='text-left'>
                                        Kepegawaian
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Menu link="/admin/cms/laporan"><span className='text-sm'>Laporan</span></Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className='text-left'>
                                        Data Master
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Menu link="/admin/cms/laporan"><span className='text-sm'>Laporan</span></Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        {/* <Menu icons="icon" link="/admin/cms/kelola-kasir">Kelola Kasir</Menu> */}
                    </div>

                </div>
            </div>
            {/* KONTEN */}
            <div className="konten lg:px-0 px-[10px] lg:mr-[20px] lg:ml-[290px]  pt-[80px] h-full">
                <div className="konten  overflow-auto h-[90%] p-3 lg:px-1">
                    {/* konten */}
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default LayoutAdmin
