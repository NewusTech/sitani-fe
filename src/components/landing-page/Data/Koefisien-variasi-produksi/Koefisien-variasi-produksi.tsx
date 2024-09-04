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
    bulan?: string;
    panen?: string;
    gkpTkPetani?: string;
    gkpTkPenggilingan?: string;
    gkgTkPenggilingan?: string;
    jpk?: string;
    cabaiMerahKeriting?: string;
    berasMedium?: string;
    berasPremium?: string;
    stokGkg?: string;
    stokBeras?: string;

}

const KomponenKoefisienVariasiPrduksi = () => {
    // INTEGRASI
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const data: Data[] = [
        {
            bulan: "Januari",
            panen: "Januari",
            gkpTkPetani: "48700",
            gkpTkPenggilingan: "19400",
            gkgTkPenggilingan: "25350",
            jpk: "25350",
            cabaiMerahKeriting: "25350",
            berasMedium: "25350",
            berasPremium: "25350",
            stokGkg: "25350",
            stokBeras: "25350",
        },
        {
            bulan: "Januari",
            panen: "Januari",
            gkpTkPetani: "48700",
            gkpTkPenggilingan: "19400",
            gkgTkPenggilingan: "25350",
            jpk: "25350",
            cabaiMerahKeriting: "25350",
            berasMedium: "25350",
            berasPremium: "25350",
            stokGkg: "25350",
            stokBeras: "25350",
        },
    ];

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header flex justify-between items-center">
                    <div className="search w-[70%]">
                        <div className="text-primary font-semibold text-lg lg:text-3xl flex-shrink-0">
                            Koefesian variasi tingkat produksi</div>
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
                            <TableHead className="text-primary py-3">% Panen</TableHead>
                            <TableHead className="text-primary py-3">GKP Tk. Petani</TableHead>
                            <TableHead className="text-primary py-3">GkP Tk. Penggilingan</TableHead>
                            <TableHead className="text-primary py-3">GKG Tk. Penggilingan</TableHead>
                            <TableHead className="text-primary py-3">JPK</TableHead>
                            <TableHead className="text-primary py-3">Cabai Merah Keriting</TableHead>
                            <TableHead className="text-primary py-3">Beras Medium</TableHead>
                            <TableHead className="text-primary py-3">Beras Premium</TableHead>
                            <TableHead className="text-primary py-3">Stok GKG</TableHead>
                            <TableHead className="text-primary py-3">Stok Beras</TableHead>
                            <TableHead className="text-primary py-3">Aksi</TableHead>
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
                                    {item.panen}
                                </TableCell>
                                <TableCell>
                                    {item.gkpTkPetani}
                                </TableCell>
                                <TableCell>
                                    {item.gkpTkPenggilingan}
                                </TableCell>
                                <TableCell>
                                    {item.gkgTkPenggilingan}
                                </TableCell>
                                <TableCell>
                                    {item.jpk}
                                </TableCell>
                                <TableCell>
                                    {item.cabaiMerahKeriting}
                                </TableCell>
                                <TableCell>
                                    {item.berasMedium}
                                </TableCell>
                                <TableCell>
                                    {item.berasPremium}
                                </TableCell>
                                <TableCell>
                                    {item.stokGkg}
                                </TableCell>
                                <TableCell>
                                    {item.stokBeras}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Link className='' href="/ketahanan-pangan/koefisien-variasi-produksi/detail">
                                            <EyeIcon />
                                        </Link>
                                        <Link className='' href="/ketahanan-pangan/koefisien-variasi-produksi/edit">
                                            <EditIcon />
                                        </Link>
                                        <DeletePopup onDelete={() => { }} />
                                    </div>
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
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Maksimum</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Minimum</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>Target CV</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='text-primary py-3' colSpan={2}>CV (%)</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3">$2,500.00</TableCell>
                            <TableCell className="text-primary py-3"></TableCell>
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

export default KomponenKoefisienVariasiPrduksi