"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
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

const KoefisienVariasiProdusen = () => {
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
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Daftar dagingSapi Produsen dan Eceran</div>
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
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right">
                    <Link href="/ketahanan-pangan/koefisien-variasi-produsen/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
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

export default KoefisienVariasiProdusen