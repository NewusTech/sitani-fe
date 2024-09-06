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
    desa?: string;
    hasilProduksi?: string;
    namaTanaman?: string;
    luasTanamanAkhirBulanLalu?: string;
    luasPanen: {
        habisDibongkar?: number;
        belumHabis?: number;
    }
    luasRusak?: string;
    luasPenanamanBaru?: string;
    luasTanamanAkhirBulanLaporan?: string;
    produksiKuintal: {
        dipanenHabis?: number;
        belumHabis?: number;
    }
    rataRataHargaJual?: string;
    keterangan?: string;
}

const KorluPalawija = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const data: Data[] = [
        {
            kecamatan: "Metro Kibang",
            desa: "Metro",
            hasilProduksi: "Palawija",
            namaTanaman: "Padi",
            luasTanamanAkhirBulanLalu: "100 hektar",
            luasPanen: {
                habisDibongkar: 23,
                belumHabis: 345,
            },
            luasRusak: "100 hektar",
            luasPenanamanBaru: "100 hektar",
            luasTanamanAkhirBulanLaporan: "100 hektar",
            produksiKuintal: {
                dipanenHabis: 23,
                belumHabis: 345,
            },
            rataRataHargaJual: "100 hektar",
            keterangan: "100 hektar",
        },
    ];

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">KJF Kabupaten Palawija</div>
            {/* title */}

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
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {startDate ? format(startDate, "PPP") : <span>Tanggal Awal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar className=''
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setstartDate}
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
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {endDate ? format(endDate, "PPP") : <span>Tanggal Akhir</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setendDate}
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
                    <div className="w-full">
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
                    <Link href="/kjf-kabupaten/palawija/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            Uraian
                        </TableHead>
                        <TableHead colSpan={7} className="text-primary border border-slate-200 text-center py-1">
                            Lahan Sawah
                        </TableHead>
                        <TableHead colSpan={7} className="text-primary border border-slate-200 text-center py-1">
                            Lahan Bukan Sawah
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)
                        </TableHead>
                        <TableHead rowSpan={3} className="text-primary py-1 text-center">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow >
                        {/* Lahan Sawah */}
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Yang Lalu
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen Muda
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen  Untuk Hijauan Pakan Ternak
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanam
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Puso/rusak
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Laporan ((3)-(4)-(5)-(6)+(7)-(8))
                        </TableHead>
                        {/* Lahan Bukan Sawah */}
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Yang Lalu
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen Muda
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen  Untuk Hijauan Pakan Ternak
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanam
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Puso/rusak
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Laporan ((3)-(4)-(5)-(6)+(7)-(8))
                        </TableHead>

                    </TableRow>
                    <TableRow >
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (1)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (2)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (3)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (4)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (5)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (6)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (7)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (8)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (9)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (10)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (11)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (12)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (13)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (14)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (15)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (16)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (17)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* jumlah jagung */}
                    <TableRow>
                        <TableCell>
                            1.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            Jumlah Jagung
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            455
                        </TableCell>
                        <TableCell className=' font-semibold text-center border border-slate-200'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell className=' font-semibold text-center border border-slate-200'>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center '>
                            455
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Link className='' href="/korlub/padi/detail">
                                    <EyeIcon />
                                </Link>
                                <Link className='' href="/korlub/padi/edit">
                                    <EditIcon />
                                </Link>
                                <DeletePopup onDelete={() => { }} />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            A. Hibrida
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            1). Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            2). Non Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            B. Komplit
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            C. Lokal
                        </TableCell>
                    </TableRow>
                    {/* jumlah jagung */}
                    {/* Kedelai */}
                    <TableRow>
                        <TableCell>
                            2
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            Kedelai
                        </TableCell>
                    </TableRow>
                    {/* Kedelai */}
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            a. Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            b. Non Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                    </TableRow>
                    {/* Kedelai */}
                    {/* Kacang Tanah */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            4.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Jumlah Ubi Kayusingkong
                        </TableCell>
                    </TableRow>
                    {/* Kacang Tanah */}
                    {/* Jumlah Ubi Kayusingkong */}
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            a. Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            b. Non Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            234234
                        </TableCell>
                    </TableRow>
                    {/* Jumlah Ubi Kayusingkong */}
                    {/* Ubi Jalar/Ketela Rambat */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            5.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            UbiJalar Ketela/Ketela Rambat
                        </TableCell>
                    </TableRow>
                    {/* Ubi Jalar/Ketela Rambat */}
                    {/* Kacang Hijau */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            6.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Kacang Hijau
                        </TableCell>
                    </TableRow>
                    {/* Kacang Hujau */}
                    {/* Sorgum Centel */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            7.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Sorgumcantel
                        </TableCell>
                    </TableRow>
                    {/* Sorgum Centel */}
                    {/* Gandum */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            8.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Gandum
                        </TableCell>
                    </TableRow>
                    {/* Gandum */}
                    {/* Talas */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            9.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Talas
                        </TableCell>
                    </TableRow>
                    {/* Talas */}
                    {/* Ganyong */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            10.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Ganyong
                        </TableCell>
                    </TableRow>
                    {/* Ganyong */}
                    {/* umbi lainnya */}
                    <TableRow>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            11.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Umbi Lainnya
                        </TableCell>
                    </TableRow>
                    {/* Umbi lainnya */}
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

export default KorluPalawija