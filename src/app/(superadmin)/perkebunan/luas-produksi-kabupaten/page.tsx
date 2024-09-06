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
import Link from 'next/link'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'

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

const LuasKabPage = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const data: Data[] = [
        {
            kecamatan: "Metro Kibang",
            desa: "Metro",
            hasilProduksi: "12000",
            namaTanaman: "50000",
            luasTanamanAkhirBulanLalu: "100000",
            luasPanen: {
                habisDibongkar: 23,
                belumHabis: 345,
            },
            luasRusak: "100",
            luasPenanamanBaru: "100",
            luasTanamanAkhirBulanLaporan: "100",
            produksiKuintal: {
                dipanenHabis: 23,
                belumHabis: 345,
            },
            rataRataHargaJual: "100",
            keterangan: "100",
        },
    ];

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kabupaten )</div>
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
                    <Link href="/perkebunan/luas-produksi-kabupaten/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead colSpan={10} className='text-primary py-1 border border-slate-200 text-center'>
                            Atap 2022
                        </TableHead>
                        <TableHead colSpan={9} className='text-primary py-1 border border-slate-200 text-center'>
                            Asem 2023
                        </TableHead>
                    </TableRow>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>

                        {/* Atap */}
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="text-center items-center">
                                Komoditi
                            </div>
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Komposisi Luas Areal
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            <div className="text-center items-center">
                                Jumlah
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            <div className="text-center items-center">
                                Produksi (TON)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Produktivitas Kg/Ha
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Jumlah Petani Perkebunan (KK)
                            </div>
                        </TableHead>

                        {/* Asem */}
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="text-center items-center">
                                Komoditi
                            </div>
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Komposisi Luas Areal
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            <div className="text-center items-center">
                                Jumlah
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            <div className="text-center items-center">
                                Produksi (TON)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Produktivitas Kg/Ha
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Jumlah Petani Perkebunan (KK)
                            </div>
                        </TableHead>

                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        {/* Atap */}
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TBM
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TM
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TR
                        </TableHead>

                        {/* Asem */}
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TBM
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TM
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TR
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            I
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Tan. Tahunan
                        </TableCell>
                    </TableRow>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            {/* Atap */}

                            <TableCell className='border border-slate-200 text-center'>
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                {item.namaTanaman}
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                {item.hasilProduksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasTanamanAkhirBulanLalu}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasPanen.habisDibongkar}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasPanen.belumHabis}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasRusak}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasPenanamanBaru}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasTanamanAkhirBulanLaporan}
                            </TableCell>

                            {/* Asam */}
                            <TableCell className='border border-slate-200 text-center'>
                                {index + 1}
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                {item.namaTanaman}
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                {item.hasilProduksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasTanamanAkhirBulanLalu}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasPanen.habisDibongkar}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasPanen.belumHabis}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasRusak}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.luasPenanamanBaru}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/perkebunan/luas-produksi-kabupaten/detail">
                                        <EyeIcon />
                                    </Link>
                                    <Link className='' href="/perkebunan/luas-produksi-kabupaten/edit">
                                        <EditIcon />
                                    </Link>
                                    <DeletePopup onDelete={async () => { }} />
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

                        {/* jumlah */}
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
                        {/* Jumlah */}

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
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default LuasKabPage