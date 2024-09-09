"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'
import { id } from 'date-fns/locale';

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
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import { Badge } from '@/components/ui/badge'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
}

interface ListItem {
    id: number;
    kepangCvProdusenId: number;
    kepangMasterKomoditasId: number;
    nilai: number;
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    bulan: string; // ISO 8601 format date-time
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
    list: ListItem[];
}

interface Response {
    status: number;
    message: string;
    data: DataItem[];
}

const KoefisienVariasiProdusen = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination
    // serach
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    // serach

    const { data, error } = useSWR<Response>(
        `/kepang/cv-produsen/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;

    const allKomoditas = new Set<string>();
    data.data.forEach((item) => {
        item.list.forEach((komoditas) => {
            allKomoditas.add(komoditas.komoditas.nama);
        });
    });
    const uniqueKomoditas = Array.from(allKomoditas);

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/kepang/cv-produsen/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id)
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil dihapus!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
            // Update the local data after successful deletion
            mutate('/kepang/cv-produsen/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        }
    };

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Data Coefesien Variasi CV Tingkat Produsen</div>
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
                        <Link href="/ketahanan-pangan/koefisien-variasi-produsen/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Tambah Data
                        </Link>
                    </div>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">Bulan</TableHead>
                        {uniqueKomoditas.map((komoditas) => (
                            <TableHead key={komoditas} className="text-primary py-3">{komoditas}</TableHead>
                        ))}
                        {/* <TableHead className="text-primary py-3">Aksi</TableHead> */}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{format(new Date(item.bulan), 'MMMM', { locale: id })}</TableCell>
                            {uniqueKomoditas.map((komoditas) => {
                                const foundCommodity = item.list.find(k => k.komoditas.nama === komoditas);
                                return (
                                    <TableCell key={komoditas}>
                                        {foundCommodity ? (
                                            <div className="flex items-center gap-4">
                                                <Link href={`/ketahanan-pangan/koefisien-variasi-produsen/detail/${foundCommodity.id}`}>
                                                    <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                                                        <EyeIcon />
                                                    </div>
                                                </Link>
                                                <Link href={`/ketahanan-pangan/koefisien-variasi-produsen/edit/${foundCommodity.id}`}>
                                                    <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                                                        <EditIcon />
                                                    </div>
                                                </Link>
                                                <DeletePopup onDelete={() => handleDelete(String(foundCommodity?.id))} />
                                                <div className="nav flex pr-4 text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] justify-between transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                                                    <Badge variant="primary">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(foundCommodity.nilai)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                );
                            })}
                            {/* Aksi */}
                            {/* <TableCell>
                                <div className="flex items-center gap-4">
                                    <DeletePopup onDelete={() => handleDelete(String(item?.id))} />
                                </div>
                            </TableCell> */}
                        </TableRow>
                    ))}
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

export default KoefisienVariasiProdusen