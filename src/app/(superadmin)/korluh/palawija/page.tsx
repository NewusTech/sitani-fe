"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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
// 
import Swal from 'sweetalert2';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import PaginationTable from '@/components/PaginationTable';

const KorluPalawija = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()
    const formatDate = (date?: Date): string => {
        if (!date) return ""; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };
    const filterDate = formatDate(startDate);
    // console.log(filterDate)
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataPalawija }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `/korluh/palawija/get?limit=1&page=${currentPage}&equalDate=${filterDate}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // delete
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/korluh/palawija/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
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
            console.log(id)
            // Update the local data after successful deletion
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menghapus data!';
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: errorMessage,
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.error("Failed to create user:", error);
        } mutate(`/korluh/palawija/get?limit=1&page=${currentPage}&equalDate=${filterDate}`);
    };

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Korluh Palawija</div>
            {/* title */}

            {/* top */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-2 lg:gap-2 flex justify-start items-center w-full">
                    <div className="md:w-auto w-full">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[14px] md:text-[11px] lg:text-sm",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {startDate ? format(startDate, "PPP") : <span>Pilih Tanggal</span>}
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
                    {/* filter table */}
                    {/* <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div> */}
                    <div className="header flex gap-2 justify-end items-center">
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
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    {/* <div className="w-full">
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
                    </div> */}
                    <Link href="/korluh/palawija/tambah" className='bg-primary px-3 md:px-8 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-base mb-3'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* bulan */}
            <div className="md:mt-2 mt-1 flex items-center gap-2">
                <div className="font-semibold">
                    Tanggal:
                </div>
                {dataPalawija?.data?.data.map((item: any, index: any) => (
                    <div key={index}>
                        {item.tanggal
                            ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })
                            : 'Tanggal tidak tersedia'}
                    </div>

                ))}
            </div>
            {/* bulan */}
            {/* kecamatan */}
            <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                <div className="flex items-center gap-2">
                    <div className="font-semibold">
                        Kecamatan:
                    </div>
                    {dataPalawija?.data?.data.map((item: any, index: any) => (
                        <div key={index}>
                            {item?.kecamatan.nama || "Tidak ada data"}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="font-semibold">
                        Desa:
                    </div>
                    {dataPalawija?.data?.data.map((item: any, index: any) => (
                        <div key={index}>
                            {item?.desa.nama || "Tidak ada data"}
                        </div>
                    ))}
                </div>
            </div>
            {/* kecamatan */}

            {/* table */}
            <Table className='border border-slate-200 mt-2'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            Uraian
                        </TableHead>
                        <TableHead colSpan={5} className="text-primary border border-slate-200 text-center py-1">
                            Lahan Sawah
                        </TableHead>
                        <TableHead colSpan={5} className="text-primary border border-slate-200 text-center py-1">
                            Lahan Bukan Sawah
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary text-center py-1 border border-slate-200">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow >
                        {/* Lahan Sawah */}
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
                        {/* Lahan Bukan Sawah */}
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataPalawija?.data?.data && dataPalawija?.data?.data?.length > 0 ? (
                        dataPalawija.data.data.map((item: any, index: number) => (
                            <>
                                {/* jumlah jagung */}
                                <TableRow>
                                    <TableCell>
                                        1.
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold text-center'>
                                        Jumlah Jagung
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[17]?.produksi ?? "-"}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold '>
                                        A. Hibrida
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[18]?.produksi ?? "-"}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 '>
                                        1). Bantuan Pemerintah
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[1]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[1]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[1].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[1].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[1].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 '>
                                        2). Non Bantuan Pemerintah
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[2]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[2]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[2].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[2].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[2].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold '>
                                        B. Komposit
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[3]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[3]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[3].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[3].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[3].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold '>
                                        C. Lokal
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[4]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[4]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[4].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[4].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[4].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[19]?.produksi ?? "-"}
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
                                        {item[5]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[5]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[5]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[5].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[5].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[5].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 '>
                                        b. Non Bantuan Pemerintah
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[6]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[6]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[6].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[6].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[6].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {/* Kedelai */}
                                {/* Kacang Tanah */}
                                <TableRow>
                                    <TableCell className='border border-slate-200 font-semibold text-center'>
                                        3.
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>
                                        Kacang Tanah
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[7]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[7]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[7].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[7].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[7].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {/* Kacang Tanah */}
                                {/* Jumlah Ubi Kayusingkong */}
                                <TableRow>
                                    <TableCell className='border border-slate-200 font-semibold text-center'>
                                        4.
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>
                                        Jumlah Ubi Kayu Singkong
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[20]?.produksi ?? "-"}
                                    </TableCell>
                                </TableRow>
                                {/* Jumlah Ubi Kayusingkong */}
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 '>
                                        a. Bantuan Pemerintah
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[8]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[8]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[8].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[8].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[8].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell className='border border-slate-200 '>
                                        b. Non Bantuan Pemerintah
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[9]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[9]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[9].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[9].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[9].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {/* Jumlah Ubi Kayusingkong */}
                                {/* Ubi Jalar/Ketela Rambat */}
                                <TableRow>
                                    <TableCell className='border border-slate-200 font-semibold text-center'>
                                        5.
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>
                                        Ubi Jalar Ketela/Ketela Rambat
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[10]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[10]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[10].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[10].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[10].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[11]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[11]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[11].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[11].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[11].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {/* Kacang Hujau */}
                                {/* Sorgum Centel */}
                                <TableRow>
                                    <TableCell className='border border-slate-200 font-semibold text-center'>
                                        7.
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>
                                        Sorgum / Cantel
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[12]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[12]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[12].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[12].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[12].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[13]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[13]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[13].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[13].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[13].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[14]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[14]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[14].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[14].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[14].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[15]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[15]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[15].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[15].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[15].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanBukanSawahPanen ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanBukanSawahPanenMuda ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanBukanSawahTanam ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.lahanBukanSawahPuso ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item[16]?.produksi ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3 justify-center">
                                                {item[16]?.id && (
                                                    <>
                                                        {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[16].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                        <Link title="Edit" href={`/korluh/palawija/edit/${item[16].id}`}>
                                                            <EditIcon />
                                                        </Link>
                                                        <DeletePopup onDelete={() => handleDelete(String(item[16].id))} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={13} className='text-center'>Tidak Ada Data</TableCell>
                        </TableRow>
                    )}
                    {/* Umbi lainnya */}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataPalawija?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataPalawija?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default KorluPalawija