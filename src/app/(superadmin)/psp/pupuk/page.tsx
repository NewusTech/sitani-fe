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


const Pupuk = () => {
    // TES
    interface Data {
        id?: number; // Ensure id is a number
        jenisPupuk?: string;
        kandunganPupuk?: string;
        keterangan?: string;
        hargaPupuk?: number; // Change to number
    }

    interface Response {
        status: number;
        message: string;
        data: {
            data: Data[];
            pagination: {
                page: number;
                perPage: number;
                totalPages: number;
                totalCount: number;
                links: {
                    prev: string | null;
                    next: string | null;
                };
            };
        };
    }

    const [startDate, setstartDate] = React.useState<Date>();
    const [endDate, setendDate] = React.useState<Date>();

    const dummyData: Data[] = [
        {
            id: 1,
            jenisPupuk: "jenis pupuk a",
            kandunganPupuk: "banyak pokoknya",
            keterangan: "tidak ada keterangan",
            hargaPupuk: 150000,
        },
    ];

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataUser }: SWRResponse<Response> = useSWR(
        `/psp/pupuk/get?page=1&limit=10&search&startDate=&endDate`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => {
                    // Jika data dari API kosong, gunakan data dummy
                    if (res.data.data.data.length === 0) {
                        return { ...res.data, data: { ...res.data.data, data: dummyData } };
                    }
                    return res.data;
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    return { status: 500, message: "Failed to fetch data", data: { data: dummyData, pagination: { page: 1, perPage: 1, totalPages: 1, totalCount: 1, links: { prev: null, next: null } } } };
                })
    );

    const handleDelete = async (id: number) => {
        try {
            await axiosPrivate.delete(`/psp/pupuk/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id);
            // Update the local data after successful deletion
            mutate('/psp/pupuk/get?page=1&limit=10&search&startDate=&endDate');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id);
            // Add notification or alert here for user feedback
        }
    };

    console.log(dataUser);

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Pupuk</div>
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
                    <Link href="/psp/pupuk/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[140px]'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-1">No</TableHead>
                        <TableHead className="text-primary py-1">Jenis Pupuk</TableHead>
                        <TableHead className="text-primary py-1">Kandungan Pupuk</TableHead>
                        <TableHead className="text-primary py-1">Keterangan</TableHead>
                        <TableHead className="text-primary py-1">Harga Pupuk</TableHead>
                        <TableHead className="text-primary py-1">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataUser?.data?.data && dataUser.data.data.length > 0 ? (
                        dataUser.data.data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {item.jenisPupuk}
                                </TableCell>
                                <TableCell>
                                    {item.kandunganPupuk}
                                </TableCell>
                                <TableCell>
                                    {item.keterangan}
                                </TableCell>
                                <TableCell>
                                    {item.hargaPupuk}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Link className='' href={`/psp/pupuk/detail/${item.id}`}>
                                            <EyeIcon />
                                        </Link>
                                        <Link className='' href={`/psp/pupuk/edit/${item.id}`}>
                                            <EditIcon />
                                        </Link>
                                        <DeletePopup onDelete={() => handleDelete(item.id || 0)} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
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

export default Pupuk