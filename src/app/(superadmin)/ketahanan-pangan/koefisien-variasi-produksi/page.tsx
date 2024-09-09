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
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Paginate from '@/components/ui/paginate'


const KoefisienVariasiProduksi = () => {
    // Fungsi untuk mengubah format tanggal menjadi nama bulan
    const getMonthName = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date); // 'id-ID' untuk bahasa Indonesia
    };

    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    // INTEGRASI
    // GET LIST
    interface Response {
        status: number;
        message: string;
        data: ProduksiData[];
    }

    interface ProduksiData {
        id: number;
        bulan: string; // ISO date string
        panen: number;
        gkpTkPetani: number;
        gkpTkPenggilingan: number;
        jpk: number;
        cabaiMerahKeriting: number;
        berasMedium: number;
        berasPremium: number;
        stokGkg: number;
        stokBeras: number;
        createdAt: string; // ISO date string
        updatedAt: string; // ISO date string
    }


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataProduksi }: SWRResponse<Response> = useSWR(
        `/kepang/cv-produksi/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET LIST
    // INTEGRASI
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Coefesien Variasi CV Tingkat Produksi</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
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
            {/* top */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-4">
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
                <div className="w-full mt-4 lg:mt-0">
                    <div className="flex justify-end">
                        <Link href="/ketahanan-pangan/koefisien-variasi-produksi/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm'>
                            Tambah Data
                        </Link>
                    </div>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">Bulan</TableHead>
                        <TableHead className="text-primary py-3">% Panen</TableHead>
                        <TableHead className="text-primary py-3">GKP Tk. Petani</TableHead>
                        <TableHead className="text-primary py-3">GKP Tk. Penggilingan</TableHead>
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
                    {dataProduksi?.data && dataProduksi?.data?.length > 0 ? (
                        dataProduksi?.data?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {getMonthName(item.bulan)}
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
                                    belum ada
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
                                        <DeletePopup onDelete={async () => { }} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
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

export default KoefisienVariasiProduksi