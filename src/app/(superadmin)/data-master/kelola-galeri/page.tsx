"use client";

import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import Image from 'next/image';

interface Data {
    gambar?: string;
    deskripsi?: string;
}

const KelolaGaleriPage = () => {
    const data: Data[] = [
        {
            gambar: "https://static.gatra.com/foldershared/images/2019/thytha/09-Sep/lahan-pertanian-shutterstock.jpg",
            deskripsi: "Bupati Dawam Umumkan Peresmian Mal Pelayanan Publik (MPP) Lampung Timur pada 2024",
        },
        {
            gambar: "https://static.gatra.com/foldershared/images/2019/thytha/09-Sep/lahan-pertanian-shutterstock.jpg",
            deskripsi: "Bupati Dawam Umumkan Peresmian Mal Pelayanan Publik (MPP) Lampung Timur pada 2024",
        },
    ];
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Kelola Galeri</div>
            {/* title */}
            {/* head */}
            <div className="header flex md:flex-row flex-col gap-2 justify-between items-center">
                <div className="search md:w-[50%] w-full">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="right md:w-fit w-full flex justify-end md:mt-0 mt-2">
                    <Link href="/data-master/kelola-galeri/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* head */}
            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">gambar</TableHead>
                        <TableHead className="text-primary py-3">deskripsi</TableHead>
                        <TableHead className="text-primary py-3">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                <div className="w-[150px] h-[150px]">
                                    <Image src={item.gambar || "../../assets/images/galeri1.png"} alt="logo" width={300} height={300} unoptimized className='w-full h-full object-cover' />
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.deskripsi}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link href="/data-master/kelola-berita/edit">
                                        <EditIcon />
                                    </Link>
                                    <DeletePopup onDelete={() => { }} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default KelolaGaleriPage