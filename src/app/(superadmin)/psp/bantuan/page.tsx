"use client";

import { Input } from '@/components/ui/input'
import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
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
import DeletePopup from '@/components/superadmin/PopupDelete'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Data {
    kecamatan?: string;
    desa?: string;
    jenisBantuan?: string;
    periode?: string;
    keterangan?: string;
}

const Bantuan = () => {
    const data: Data[] = [
        {
            kecamatan: "123456789",
            desa: "Jakarta",
            jenisBantuan: "1990-01-01",
            periode: "Pembina Utama IV/a",
            keterangan: "2022-01-01",
        },
    ];

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Bantuan</div>
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
            <div className="date mt-5 gap-2 flex justify-start items-center">
                <div className="">
                    <Input
                        type='date'
                        className='w-fit py-2'
                    />
                </div>
                <div className="">to</div>
                <div className="">
                    <Input
                        type='date'
                        className='w-fit py-2'
                    />
                </div>
                <div className="fil-kect w-[170px]">
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
                <div className="w-[40px] h-[40px]">
                    <Button variant="outlinePrimary" className=''>
                        <FilterIcon />
                    </Button>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-1">No</TableHead>
                        <TableHead className="text-primary py-1">Kecamatan</TableHead>
                        <TableHead className="text-primary py-1">Desa</TableHead>
                        <TableHead className="text-primary py-1">Jenis Bantuan</TableHead>
                        <TableHead className="text-primary py-1">Periode</TableHead>
                        <TableHead className="text-primary py-1">Keterangan</TableHead>
                        <TableHead className="text-primary py-1">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {item.kecamatan}
                            </TableCell>
                            <TableCell>
                                {item.desa}
                            </TableCell>
                            <TableCell>
                                {item.jenisBantuan}
                            </TableCell>
                            <TableCell>
                                {item.periode}
                            </TableCell>
                            <TableCell>
                                {item.keterangan}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/kepegawaian/data-pegawai/detail-pegawai">
                                        <EyeIcon />
                                    </Link>
                                    <Link className='' href="/kepegawaian/data-pegawai/edit-pegawai">
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

export default Bantuan