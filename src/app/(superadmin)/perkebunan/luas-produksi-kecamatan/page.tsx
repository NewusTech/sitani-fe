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
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const LuasKecPage = () => {
    const [date, setDate] = React.useState<Date>()

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kecamatan )</div>
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
                    <Link href="/perkebunan/luas-produksi-kecamatan/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
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
                            Komoditi
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Komposisi Luas Areal
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Jumlah
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produksi (Ton)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas Kg/Ha
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Jml. Petani Pekebun (KK)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Bentuk Hasil
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Keterangan
                        </TableHead>
                    </TableRow>
                    <TableRow>
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
                    {/* tan1 */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            I
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Tan. Tahunan
                        </TableCell>
                    </TableRow>
                    {/* isi */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Aren
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Gula merah
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Keterangan
                        </TableCell>
                    </TableRow>
                    {/* jumlah */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border italic font-semibold border-slate-200'>
                            Jumlah I
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                    </TableRow>
                    {/* tan1 */}
                    {/* tan2 */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            II
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Tan. Semusim
                        </TableCell>
                    </TableRow>
                    {/* isi */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Aren
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Gula merah
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Keterangan
                        </TableCell>
                    </TableRow>
                    {/* jumlah */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border italic font-semibold border-slate-200'>
                            Jumlah II
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                    </TableRow>
                    {/* tan2 */}
                    {/* tan3 */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            III
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold'>
                            Tan. Semusim
                        </TableCell>
                    </TableRow>
                    {/* isi */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Aren
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Gula merah
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Keterangan
                        </TableCell>
                    </TableRow>
                    {/* jumlah */}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border italic font-semibold border-slate-200'>
                            Jumlah III
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                    </TableRow>
                    {/* tan2 */}
                    {/* jumlah TOTAL I II III*/}
                    <TableRow >
                        <TableCell className='border border-slate-200 text-center'>
                            
                        </TableCell>
                        <TableCell className='border italic font-semibold border-slate-200'>
                            Jumlah I+II+III
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                        <TableCell className='border text-center border-slate-200'>
                            4324
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default LuasKecPage