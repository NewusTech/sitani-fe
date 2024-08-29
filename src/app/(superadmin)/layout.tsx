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
        <Link href={props.link} className={`nav flex items-center gap-4 text-left rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(props.link) ? "text-primary" : "text-black"}`}>
            <div className="icon">
                {props.icons}
            </div>
            <div className={`nama text-[18px] ${pathname.startsWith(props.link) ? "text-primary font-semibold" : "text-black/70"}`}>{props.children}</div>
        </Link>
    )
}

interface LayProps {
    link?: string;
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
            <div className="navatas lg:px-0 z-10 top-0 w-full md:w-full right-0 fixed bg-transparent">
                <div className="wra white md:ml-[290px]  bg-white md:bg-transparent   m-auto justify-between lg:justify-end py-[23px]  flex items-center gap-4 text-left">
                    <div onClick={handleNavbar} className="icon block cursor-pointer lg:hidden ">
                        {navbar ? "x" : "="}
                    </div>
                </div>
            </div>
            {/* sidebar */}
            <div className={`sidebar bg-[#F6F6F6] overflow-auto pt-[70px] lg:pt-0 z-[1] lg:z-20 lg:block h-screen fixed top-0 ${navbar ? "left-[0%]" : "left-[-100%]"} box-border lg:w-[300px] lg:shadow-none shadow-lg w-[70%] px-[30px] bg-whie transition-all duration-300 lg:left-0 `}>
                <div className="LOGO flex my-10 gap-2 items-center ">
                    <div className="logo flex-shrink-0 ">
                        <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[50px]' />
                    </div>
                    <div className="teks flex-shrink-0 text-primary">
                        <div className="head font-bold text-2xl text-primary">SITANI</div>
                        <div className="head text-base ">Super Admin</div>
                    </div>
                </div>
                <div className="wrap-nav flex bg-red flex-col gap-2">
                    <div className="wrap flex flex-col gap-1">

                        <div className='h-[73%] overflow-auto '>
                            {/* dashboard */}
                            <Link href="/dashboard" className={`nav flex pr-4 text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] ${pathname.startsWith('/dashboard') ? "bg-primary text-white" : "bg-transparent text-primary"}`} >
                                <Dashboard />
                                Dashboard
                            </Link>
                            {/* dashboard */}
                            {/* ketahanan-pangan */}
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/ketahanan-pangan') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Ketahanan Pangan
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/ketahanan-pangan/produsen-dan-eceran">
                                            <span className='text-sm'>Produsen dan Eceran </span>
                                        </Menu>
                                        <Menu link="/ketahanan-pangan/luas-areal-dan-produksi-kec">
                                            <span className='text-sm'>Luas Areal dan Produksi Kec</span>
                                        </Menu>
                                        <Menu link="/ketahanan-pangan/luas-areal-dan-produksi-kab">
                                            <span className='text-sm'>Luas Areal dan Produksi Kab</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {/* ketahanan-pangan */}
                            {/* tanaman-pangan */}
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/tanaman-pangan-holtikutura') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Tanaman Pangan dan Holtikulturan
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/tanaman-pangan-holtikutura/realisasi">
                                            <span className='text-sm'>Realisasi</span>
                                        </Menu>
                                        <Menu link="/tanaman-pangan-holtikutura/lahan">
                                            <span className='text-sm'>Lahan</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {/* tanaman-pangan */}
                            {/* penyuluhan */}
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/penyuluhan') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Penyuluhan
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/penyuluhan/data-kabupaten">
                                            <span className='text-sm'>Data Kabupaten</span>
                                        </Menu>
                                        <Menu link="/penyuluhan/data-kecamatan">
                                            <span className='text-sm'>Data Kecamatan</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {/* penyuluhan */}
                            {/* PSP */}
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/psp') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        PSP
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/kepegawaian/data-pegawai">
                                            <span className='text-sm'>Data Pegawai</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {/* PSP */}
                            {/* kepegawaian */}
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/kepegawaian/') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Kepegawaian
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/kepegawaian/data-pegawai">
                                            <span className='text-sm'>Data Pegawai</span>
                                        </Menu>
                                        <Menu link="/kepegawaian/tambah-pegawai">
                                            <span className='text-sm'>Tambah Pegawai</span>
                                        </Menu>
                                        <Menu link="/kepegawaian/data-pensiun">
                                            <span className='text-sm'>Data Pensiun</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {/* kepegawaian */}
                            {/* data-master */}
                            <Accordion className='' type="single" collapsible>
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/data-master') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Data Master
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/kepegawaian/data-pegawai">
                                            <span className='text-sm'>Data Pegawai</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {/*data-master */}
                        </div>
                    </div>

                </div>
            </div>
            {/* KONTEN */}
            <div className="konten lg:px-0 px-[10px] lg:mr-[20px] lg:ml-[320px]  pt-[15px] h-full">
                <div className="konten  overflow-auto h-[90%] p-3 lg:px-1">
                    {/* konten */}
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default LayoutAdmin
