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
import CloseNav from '../../../public/icons/CloseNav';
import OpenNav from '../../../public/icons/OpenNav';


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
            <div className="navatas lg:px-0 z-10 top-0 w-full md:w-full right-0 fixed md:bg-transparent bg-[#F6F6F6] py-2 pr-4">
                <div className="wra white md:ml-[290px]  bg-transparent   m-auto justify-end lg:justify-end md:py-[23px]  flex items-center gap-4 text-left">
                    <div onClick={handleNavbar} className="icon  flex cursor-pointer lg:hidden bg-primary rounded p-2 w-[40px]  justify-center items-center px-2 text-white ">
                        {navbar ? <CloseNav /> : <OpenNav />}
                    </div>
                </div>
            </div>
            {/* sidebar */}
            <div className={`sidebar bg-[#F6F6F6] overflow-auto z-50 pt-[10px] lg:pt-0 lg:z-20 lg:block h-screen fixed top-0 ${navbar ? "left-[0%]" : "left-[-100%]"} box-border lg:w-[300px] lg:shadow-none shadow-lg w-[75%] px-[30px] bg-whie transition-all duration-300 lg:left-0 `}>
                <div className="LOGO flex my-5 md:my-10 gap-2 items-center ">
                    <div className="logo flex-shrink-0 ">
                        <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[50px]' />
                    </div>
                    <div className="teks flex-shrink-0 text-primary">
                        <div className="head font-bold text-2xl text-primary">SITANI</div>
                        <div className="head text-base ">Super Admin</div>
                    </div>
                </div>
                <div className="wrap-nav flex bg-red flex-col gap-2 mb-10">
                    <div className="wrap flex flex-col gap-1">
                        <div className='h-[73%] overflow-auto '>
                            {/* dashboard */}
                            <Link href="/dashboard" className={`nav flex pr-4 text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] ${pathname.startsWith('/dashboard') ? "bg-primary text-white" : "bg-transparent text-primary"}`} >
                                <Dashboard />
                                Dashboard
                            </Link>
                            {/* dashboard */}
                            <Accordion className='' type="single" collapsible>
                                {/* ketahanan-pangan */}
                                <AccordionItem className='pl-2' value="item-1">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/ketahanan-pangan') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Ketahanan Pangan
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/ketahanan-pangan/produsen-dan-eceran">
                                            <span className='text-sm'>Harga Produsen & Eceran </span>
                                        </Menu>
                                        <Menu link="/ketahanan-pangan/harga-pangan-eceran">
                                            <span className='text-sm'>Harga Pangan Eceran</span>
                                        </Menu>
                                        <Menu link="/ketahanan-pangan/kuisioner-pedagang-eceran">
                                            <span className='text-sm'>Kuesioner Pedagang Eceran</span>
                                        </Menu>
                                        <Menu link="/ketahanan-pangan/koefisien-variasi-produsen">
                                            <span className='text-sm'>Koefisien Variasi Produsen</span>
                                        </Menu>
                                        <Menu link="/ketahanan-pangan/koefisien-variasi-produksi">
                                            <span className='text-sm'>Koefisien Variasi Produksi</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                                {/* ketahanan-pangan */}
                                {/* tanaman-pangan */}
                                <AccordionItem className='pl-2' value="item-2">
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
                                {/* tanaman-pangan */}
                                {/* perkebunan */}
                                <AccordionItem className='pl-2' value="item-3">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/perkebunan') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Perkebunan
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/perkebunan/luas-produksi-kecamatan">
                                            <span className='text-sm'>Luas & Produksi PR (Kec)</span>
                                        </Menu>
                                        <Menu link="/perkebunan/luas-produksi-kabupaten">
                                            <span className='text-sm'>Luas & Produksi PR (Kab)</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                                {/* perkebunan */}
                                {/* penyuluhan */}
                                <AccordionItem className='pl-2' value="item-4">
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
                                {/* penyuluhan */}
                                {/* PSP */}
                                <AccordionItem className='pl-2' value="item-5">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/psp') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        PSP
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/psp/data-penerima-uppo">
                                            <span className='text-sm'>Data Penerima UPP</span>
                                        </Menu>
                                        <Menu link="/psp/pupuk">
                                            <span className='text-sm'>Pupuk</span>
                                        </Menu>
                                        <Menu link="/psp/bantuan">
                                            <span className='text-sm'>Bantuan</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                                {/* PSP */}
                                {/* kepegawaian */}
                                <AccordionItem className='pl-2' value="item-6">
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
                                {/* kepegawaian */}
                                {/* berita */}
                                {/* data-master */}
                                <AccordionItem className='pl-2' value="item-7">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/data-master') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Data Master
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/data-master/kelola-berita">
                                            <span className='text-sm'>Kelola Berita</span>
                                        </Menu>
                                        <Menu link="/data-master/kelola-galeri">
                                            <span className='text-sm'>Kelola Galeri</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                                {/*data-master */}
                                {/* peran-pengguna */}
                                <AccordionItem className='pl-2' value="item-8">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/peran-pengguna') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Peran Pengguna
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/peran-pengguna/peran">
                                            <span className='text-sm'>Peran</span>
                                        </Menu>
                                        <Menu link="/peran-pengguna/pengguna">
                                            <span className='text-sm'>Pengguna</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                                {/*peran-pengguna */}
                                {/* korlub */}
                                <AccordionItem className='pl-2' value="item-9">
                                    <AccordionTrigger className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith('/korlub') ? "bg-primary text-white" : "bg-transparent text-primary"}`}>
                                        Korlub
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-primary-600/25 mb-2 rounded-md'>
                                        <Menu link="/korlub/padi">
                                            <span className='text-sm'>Padi</span>
                                        </Menu>
                                        <Menu link="/korlub/palawija">
                                            <span className='text-sm'>Palawija</span>
                                        </Menu>
                                        <Menu link="/korlub/sayur&buah">
                                            <span className='text-sm'>Sayuran dan Buah</span>
                                        </Menu>
                                        <Menu link="/korlub/tanamanHias">
                                            <span className='text-sm'>Tanaman Hias</span>
                                        </Menu>
                                        <Menu link="/korlub/tanamanBiofarmaka">
                                            <span className='text-sm'>Tanaman Biofarmaka</span>
                                        </Menu>
                                    </AccordionContent>
                                </AccordionItem>
                                {/*korlub */}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
            {/* KONTEN */}
            <div className="konten lg:px-0 px-[10px] lg:mr-[20px] lg:ml-[320px]  md:pt-[15px] pt-[50px] h-full">
                <div className="konten  overflow-auto h-[90%] p-3 lg:px-1">
                    {/* konten */}
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default LayoutAdmin
