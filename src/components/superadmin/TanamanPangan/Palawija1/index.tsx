"use client";

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
import Link from 'next/link'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '../../PopupDelete'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Data {
    kecamatan?: string;
    kacangHijau: {
        panen?: number;
        produktivitas?: number;
        produksi?: number;
    }
    ubiKayu: {
        panen?: number;
        produktivitas?: number;
        produksi?: number;
    }
    ubiJalar: {
        panen?: number;
        produktivitas?: number;
        produksi?: number;
    }
}

const Palawija1 = () => {
    const [date, setDate] = React.useState<Date>()

    const data: Data[] = [
        {
            kecamatan: "Metro Kibang",
            kacangHijau: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiKayu: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiJalar: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            }
        },
        {
            kecamatan: "Sekampung",
            kacangHijau: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiKayu: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiJalar: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            }
        },
        {
            kecamatan: "Batanghari",
            kacangHijau: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiKayu: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiJalar: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            }
        },
    ];

    return (
        <div>
            {/* top */}
            <div className="header flex gap-2 justify-between items-center mt-4">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block">
                            Print
                        </div>
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                    <div className="w-auto">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {date ? format(date, "PPP") : <span>Tanggal Awal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar className=''
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="">-</div>
                    <div className="w-auto">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {date ? format(date, "PPP") : <span>Tanggal Akhir</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <div className="w-[150px]">
                        <Select >
                            <SelectTrigger>
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="fil-kect w-[150px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tanaman" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Link href="/tanaman-pangan-holtikutura/realisasi/palawija-1/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px]'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Kecamatan
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Kacang Hijau
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Ubi Kayu
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Ubi Jalar
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className='border border-slate-200 text-center'>
                                {index + 1}
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                {item.kecamatan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.kacangHijau.panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.kacangHijau.produksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.kacangHijau.produksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiKayu.panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiKayu.produktivitas}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiKayu.produksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiJalar.panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiJalar.produktivitas}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiJalar.produksi}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/tanaman-pangan-holtikutura/realisasi/palawija-1/detail">
                                        <EyeIcon />
                                    </Link>
                                    <Link className='' href="/tanaman-pangan-holtikutura/realisasi/palawija-1/edit">
                                        <EditIcon />
                                    </Link>
                                    <DeletePopup onDelete={() => { }} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className='border border-slate-200'>

                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            Jumlah
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                    </TableRow>
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

export default Palawija1