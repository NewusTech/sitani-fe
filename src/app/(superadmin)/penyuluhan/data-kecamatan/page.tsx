"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'

interface Data {
    kecamatan?: string;
    wilayahDesaBinaan?: string;
    nama?: string;
    nip?: string;
    pangkat?: string;
    gol?: string;
    keterangan?: string;
}

const PenyuluhDataKecamatan = () => {
    const data: Data[] = [
        {
            kecamatan: "Sukadana",
            wilayahDesaBinaan: "Melinting, Braja Selebah, Labuhan Maringgai",
            nama: "Hardono, S.P",
            nip: "123456789",
            pangkat: "Pembina Utama",
            gol: "IV/a",
            keterangan: "Keterangan"
        },
        {
            kecamatan: "Sukadana",
            wilayahDesaBinaan: "Melinting, Braja Selebah, Labuhan Maringgai",
            nama: "Hardono, S.P",
            nip: "123456789",
            pangkat: "Pembina Utama",
            gol: "IV/a",
            keterangan: "Keterangan"
        },
    ];
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Daftar Penempatan Penyuluh Pertanian Kecamatan</div>
            {/* title */}
            {/* top */}
            <div className="header flex justify-between items-center">
                <div className="search w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-3">
                    <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
                        <UnduhIcon />
                        Download
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
                        <PrintIcon />
                        Print
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="wrap-filter flex justify-between items-center mt-4 ">
                <div className="left gap-2 flex justify-start items-center">
                    <div className="fil-kect w-[185px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right">
                    <Link href="/penyuluhan/data-kecamatan/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <div className="table w-full mt-5 rounded-md overflow-hidden">
                <Table className='border border-slate-200'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow >
                            <TableHead className="text-primary py-3">Kecamatan</TableHead>
                            <TableHead className="text-primary py-3">Wilayah Desa Binaan</TableHead>
                            <TableHead className="text-primary py-3">Nama</TableHead>
                            <TableHead className="text-primary py-3">NIP</TableHead>
                            <TableHead className="text-primary py-3">
                                Pangkat
                            </TableHead>
                            <TableHead className="text-primary py-3">Gol</TableHead>
                            <TableHead className="text-primary py-3">Keterangan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {item.kecamatan}
                                </TableCell>
                                <TableCell>
                                    {item.wilayahDesaBinaan}
                                </TableCell>
                                <TableCell>
                                    {item.nama}
                                </TableCell>
                                <TableCell>
                                    {item.nip}
                                </TableCell>
                                <TableCell>
                                    {item.pangkat}
                                </TableCell>
                                <TableCell>
                                    {item.gol}
                                </TableCell>
                                <TableCell>
                                    {item.keterangan}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* table */}

            {/* pagination */}
            <div className="pagination md:mb-[0px] mb-[110px] flex md:justify-end justify-center">
                <Pagination className='md:justify-end'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            {/* pagination */}
        </div>
    )
}

export default PenyuluhDataKecamatan