"use client"

import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

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
        <Link href={props.link} className={`nav flex items-center gap-4 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(props.link) ? "bg-primary text-white" : "bg-white text-[#334155]"}`}>
            <div className="icon">
                {props.icons}
            </div>
            <div className={`nama text-[18px] ${pathname.startsWith(props.link) ? "text-white" : "text-black"}`}>{props.children}</div>
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
                <div className="wrap-nav flex bg-red flex-col gap-2 h-[73%] justify-between">
                    <div className="wrap flex flex-col gap-1">
                        {/* dash */}
                        <Menu icons="icon" link="/admin/cms/beranda">Beranda</Menu>
                        {/* produk */}
                        <div className={`nav flex flex-col items-end gap-1 `}>
                            <button onClick={handleProduk} className="button flex justify-between items-center rounded-[8px] py-[10px] px-[10px]  w-full">
                                <div className="wrap flex gap-4">
                                    <div className="icon">
                                        Icon
                                    </div>
                                    <div className={`nama text-[18px]`}>Produk</div>
                                </div>
                                arroww
                            </button>
                            {/*  */}
                            <div className={`sub flex flex-col transition-all duration-200 gap-1 ${produk ? "block" : "hidden"}`}>
                                <Menu icons="icon" link="/admin/cms/kategori">Kategori</Menu>
                                {/*  */}
                                <Menu icons="icon" link="/admin/cms/unit">Unit</Menu>
                            </div>
                        </div>
                        {/* transaksi */}
                        <Menu icons="icon" link="/admin/cms/transaksi">Transaksi</Menu>
                        {/* Laporan */}
                        <Menu icons="icon" link="/admin/cms/laporan">Laporan</Menu>
                        {/* Kasir */}
                        <Menu icons="icon" link="/admin/cms/kelola-kasir">Kelola Kasir</Menu>
                        {/* pelaporan */}
                    </div>
                    <div className="wrap flex flex-col gap-1">
                        <Menu icons="icon" link="/admin/cms/pelaporan">Pelaporan</Menu>
                        {/* Pengaturan */}
                        <Menu icons="icon" link="/admin/cms/pengaturan">Pengaturan</Menu>
                        {/* Keluar */}
                        <Menu icons="icon" link="/admin/login">Keluar</Menu>
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
