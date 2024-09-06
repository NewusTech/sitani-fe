"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
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

interface Data {
    komoditas?: string;
    harga?: string;
    keterangan?: string;
}

const KomponenHargaProdusenDanEceran = () => {
    const data: Data[] = [
        {
            komoditas: "Harga GKP Tingkat Petani",
            harga: "7100",
            keterangan: "Wilayah yang dipantau tidak panen"
        },
        {
            komoditas: "Harga GKP Tingkat Petani",
            harga: "7100",
            keterangan: "Wilayah yang dipantau tidak panen"
        },
    ];

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header flex justify-between items-center">
                    <div className="search w-[70%]">
                        <div className="text-primary font-semibold text-lg lg:text-3xl flex-shrink-0">Daftar Harga Produsen dan Eceran</div>
                    </div>
                    <div className="btn flex gap-2">
                        <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                            <UnduhIcon />
                            <div className="hidden md:block">
                                Download
                            </div>
                        </Button>
                    </div>
                </div>
                {/* header */}

                {/* table */}
                <Table className='border border-slate-200 mt-4'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow >
                            <TableHead className="text-primary py-3">No</TableHead>
                            <TableHead className="text-primary py-3">Komoditas</TableHead>
                            <TableHead className="text-primary py-3">Satuan</TableHead>
                            <TableHead className="text-primary py-3">Harga Komoditas</TableHead>
                            <TableHead className="text-primary py-3">Keterangan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {item.komoditas}
                                </TableCell>
                                <TableCell>
                                    Rp / Kg
                                </TableCell>
                                <TableCell>
                                    {`Rp ${item.harga ? new Intl.NumberFormat('id-ID').format(Number(item.harga)) : 'N/A'}`}
                                </TableCell>
                                <TableCell>
                                    {item.keterangan}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* table */}

                {/* pagination */}
                <div className="pagination md:mb-0 mb-[110px] flex md:justify-end justify-center">
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
        </div>
    )
}

export default KomponenHargaProdusenDanEceran