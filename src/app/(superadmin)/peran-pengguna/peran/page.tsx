import { Input } from '@/components/ui/input'
import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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


interface Data {
    namaPeran: string;
    hakAkses: string[];
}

const PeranPage = () => {
    const data: Data[] = [
        {
            namaPeran: "Kepala Bidang",
            hakAkses: ["create", "read", "delete"]
        },
        {
            namaPeran: "Staf",
            hakAkses: ["read"]
        },
    ];
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Peran</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="right">
                    <Link href="/peran-pengguna/peran/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* table */}
            <Table className='border border-slate-200 mt-5'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead className="text-primary py-3">Nama Peran</TableHead>
                        <TableHead className="text-primary py-3">Hak Akses</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {item.namaPeran}
                            </TableCell>
                            <TableCell>
                                {item.hakAkses.join(", ")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default PeranPage