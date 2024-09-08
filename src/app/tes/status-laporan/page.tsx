"use client";

import { Input } from '@/components/ui/input'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DeletePopup from '@/components/superadmin/PopupDelete';
import Swal from 'sweetalert2';
import SearchIcon from '../../../../public/icons/SearchIcon';
import UnduhIcon from '../../../../public/icons/UnduhIcon';
import PrintIcon from '../../../../public/icons/PrintIcon';
import EyeIcon from '../../../../public/icons/EyeIcon';
import EditIcon from '../../../../public/icons/EditIcon';
import FilterIcon from '../../../../public/icons/FilterIcon';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const StatusLaporan = () => {
    const [startDate, setstartDate] = React.useState<Date>();
    const [endDate, setendDate] = React.useState<Date>();

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Status Laporan</div>
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
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        <PrintIcon />
                        <div className="hidden md:block">
                            Print
                        </div>
                    </Button>
                    <div className="hidden m filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
            </div>
            {/*  */}
            <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full mt-4">
                <div className="wrap-filter lg:flex lg:gap-2 lg:w-full">
                    <div className="left gap-1 lg:gap-2 flex justify-start items-center w-full">
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
                        <div className="w-full h-[40px]">
                            <Button variant="outlinePrimary" className=''>
                                <FilterIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                        <Select >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Status" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Semua">Semua</SelectItem>
                                <SelectItem value="Ditolak">Ditolak</SelectItem>
                                <SelectItem value="Divalidasi">Divalidasi</SelectItem>
                                <SelectItem value="Sudah Diperbaiki">Sudah Diperbaiki</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Tanggal
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Status
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Keterangann
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow >
                        <TableCell></TableCell>
                        <TableCell className=''>
                        </TableCell>
                        <TableCell className=''>
                        </TableCell>
                        <TableCell className=''>
                        </TableCell>
                        <TableCell className=''>
                            <div className="flex items-center gap-4">
                                <Link className='' href={"/status-laporan/detail"}>
                                    <EyeIcon />
                                </Link>
                                <Link className='' href={"/status-laporan/edit"}>
                                    <EditIcon />
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={10} className="text-center">
                            Tidak ada data
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

export default StatusLaporan