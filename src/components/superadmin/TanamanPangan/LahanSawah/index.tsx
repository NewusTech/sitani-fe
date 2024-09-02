"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
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
import DeletePopup from '../../PopupDelete'

interface Data {
    kecamatan?: string;
    irigasiTeknis?: number;
    irigasi12?: number;
    irigasiSederhana?: number;
    irigasiDesa?: number;
    tadahHujan?: number;
    pasangSurut?: number;
    lebak?: number;
    lainnya?: number;
    jumlah?: number;
    ket?: string;
}

const data: Data[] = [
    {
        kecamatan: "Metro Kibang",
        irigasiTeknis: 234,
        irigasi12: 123,
        irigasiSederhana: 345,
        irigasiDesa: 324,
        tadahHujan: 234,
        pasangSurut: 13,
        lebak: 341,
        lainnya: 133,
        jumlah: 324,
        ket: "keterangan",
    },
    {
        kecamatan: "Batanghari",
        irigasiTeknis: 234,
        irigasi12: 123,
        irigasiSederhana: 345,
        irigasiDesa: 324,
        tadahHujan: 234,
        pasangSurut: 13,
        lebak: 341,
        lainnya: 133,
        jumlah: 324,
        ket: "keterangan",
    },
    {
        kecamatan: "Sekampung",
        irigasiTeknis: 234,
        irigasi12: 123,
        irigasiSederhana: 345,
        irigasiDesa: 324,
        tadahHujan: 234,
        pasangSurut: 13,
        lebak: 341,
        lainnya: 133,
        jumlah: 324,
        ket: "keterangan",
    },
];


const LahanSawah = () => {
    const [date, setDate] = React.useState<Date>()

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
                    <Link href="/tanaman-pangan-holtikutura/lahan/lahan-sawah/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah Data
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
                        <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                            Luas Lahan Sawah (Ha)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Ket
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigasi Teknis
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigas 1/2 Teknis
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigasi Sederhana
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigasi Desa/Non PU
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Tadah Hujan
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Pasang Surut
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Lebak
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Lainnya
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Jumlah
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className='border border-slate-200 text-center'>
                                {index + 1}
                            </TableCell>
                            <TableCell className='border border-slate-200 '>
                                {item.kecamatan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasiTeknis}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasi12}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasiSederhana}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasiDesa}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.tadahHujan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.pasangSurut}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.lebak}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.lainnya}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.jumlah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ket}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/tanaman-pangan-holtikutura/lahan/lahan-sawah/detail">
                                        <EyeIcon />
                                    </Link>
                                    <Link className='' href="/tanaman-pangan-holtikutura/lahan/lahan-sawah/edit">
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
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default LahanSawah