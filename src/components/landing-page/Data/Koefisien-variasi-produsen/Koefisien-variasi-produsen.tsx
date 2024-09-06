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
    bulan?: string;
    dagingSapi?: string;
    dagingAyam?: string;
    telurAyam?: string;
}

const KomponenKoefisienVariasiProdusen = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const data: Data[] = [
        {
            bulan: "Januari",
            dagingSapi: "48700",
            dagingAyam: "19400",
            telurAyam: "25350",
        },
        {
            bulan: "Januari",
            dagingSapi: "48700",
            dagingAyam: "19400",
            telurAyam: "25350",
        },
    ];

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header flex justify-between items-center">
                    <div className="search w-[70%]">
                        <div className="text-primary font-semibold text-lg lg:text-3xl flex-shrink-0">Koefesian Variasi Tingkat Produsen</div>
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
                <Table className='border border-slate-200 mt-4 lg:mt-10'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow >
                            <TableHead className="text-primary py-3">No</TableHead>
                            <TableHead className="text-primary py-3">Bulan</TableHead>
                            <TableHead className="text-primary py-3">Daging Sapi Tingkat Pemotong RPH</TableHead>
                            <TableHead className="text-primary py-3">Daging Ayam Ras</TableHead>
                            <TableHead className="text-primary py-3">Telur Ayam Ras</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {item.bulan}
                                </TableCell>
                                <TableCell>
                                    {item.dagingSapi}
                                </TableCell>
                                <TableCell>
                                    {item.dagingAyam}
                                </TableCell>
                                <TableCell>
                                    {item.telurAyam}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className='bg-primary-600'>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Rata-rata</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Maksimum</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Minimum</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Target CV</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>CV (%)</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
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

export default KomponenKoefisienVariasiProdusen