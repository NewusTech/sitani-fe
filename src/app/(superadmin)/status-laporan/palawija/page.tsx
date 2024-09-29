"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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
import SearchIcon from '../../../../../public/icons/SearchIcon';
import UnduhIcon from '../../../../../public/icons/UnduhIcon';
import PrintIcon from '../../../../../public/icons/PrintIcon';
import EyeIcon from '../../../../../public/icons/EyeIcon';
import EditIcon from '../../../../../public/icons/EditIcon';
import FilterIcon from '../../../../../public/icons/FilterIcon';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import NotFoundSearch from '@/components/SearchNotFound';
import AjukanKembali from '@/components/superadmin/Ajukan';

const StatusLaporanPalawija = () => {

    // otomatis hitung tahun
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    // const [tahun, setTahun] = React.useState("2024");
    const [tahun, setTahun] = React.useState(() => new Date().getFullYear().toString());
    // otomatis hitung tahun

    const [status, setStatus] = React.useState("");

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataStatus }: SWRResponse<any> = useSWR(
        `/status-laporan/palawija?tahun=${tahun}&status=${status === "semua" ? "" : status}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination
    // limit
    const [limit, setLimit] = useState(10);
    // limit

    function getMonthName(monthNumber: number): string {
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return monthNames[monthNumber - 1] || "Invalid Month";
    }

    // Ajukan
    const handleAjukanKembaliFunction = async (id: number) => {
        try {
            const response = await axiosPrivate.post(`/validasi/korluh-palawija/update/${id}`, {
                status: "tunggu"
            });
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil diajukan kembali!',
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
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal mengajukan kembali!';
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
        } mutate(`/status-laporan/palawija?tahun=${tahun}&status=${status === "semua" ? "" : status}`);
    };
    // Ajukan


    return (
        <div>
            {/* title */}
            <div className="md:text-2xl text-xl mb-5 font-semibold text-primary">Status Laporan Palawija</div>
            {/* title */}

            {/*  */}
            <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full mt-4">
                <div className="wrap-filter lg:flex lg:gap-2 lg:w-full">
                    <div className="left gap-1 lg:gap-2 flex justify-start items-center w-full">
                        <div className="w-[90px]">
                            <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tahun">
                                        {tahun ? tahun : "Tahun"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                        const year = startYear + index;
                                        return (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                        <Select
                            onValueChange={(value) => setStatus(value)}
                            value={status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="semua">Semua</SelectItem>
                                <SelectItem value="tolak">Ditolak</SelectItem>
                                <SelectItem value="belum">Belum Divalidasi</SelectItem>
                                <SelectItem value="terima">Diterima</SelectItem>
                                <SelectItem value="tunggu">Revisi Diajukan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            {/* top */}

            {/* keterangan */}
            {/*  */}
            <div className="keterangan flex gap-2 mt-2">
                <div className="nama font-semibold">
                    <div>Kecamatan</div>
                    <div>Tahun</div>
                </div>
                <div className="font-semibold">
                    <div>:</div>
                    <div>:</div>
                </div>
                <div className="bulan">
                    <div>
                        {dataStatus?.data?.ids?.length > 0 ? (
                            // Mengambil elemen pertama (index 0) dari dataStatus.data.ids
                            dataStatus?.data?.[dataStatus.data.ids[0]]?.[0]?.kecamatan ?? "-"
                        ) : (
                            <div>-</div>
                        )}
                    </div>
                    <div>
                        {dataStatus?.data?.ids?.length > 0 ? (
                            // Mengambil elemen pertama (index 0) dari dataStatus.data.ids
                            dataStatus?.data?.[dataStatus.data.ids[0]]?.[0]?.tahun ?? "-"
                        ) : (
                            <div>-</div>
                        )}
                    </div>
                </div>
            </div>

            {/*  */}
            {/* keterangan */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Bulan
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Status
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Keterangann
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataStatus?.data?.ids?.length > 0 ? (
                        dataStatus.data.ids.map((id: any) => (
                            dataStatus?.data[id]?.map((item: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell className='border border-slate-200 text-center'>
                                        {(currentPage - 1) * limit + (index + 1)}
                                    </TableCell>
                                    <TableCell className='border border-slate-200'>
                                        {item?.bulan ? getMonthName(item?.bulan) : "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200 '>
                                        <div className={`px-4 w-full text-center py-2 rounded-lg text-white 
                                        ${item?.status === 'belum' ? 'bg-gray-500' : ''}
                                        ${item?.status === 'terima' ? 'bg-green-500' : ''}
                                        ${item?.status === 'tolak' ? 'bg-red-500' : ''}
                                        ${item?.status === 'tunggu' ? 'bg-yellow-500' : ''}`}>
                                            {item?.status === 'belum' && 'Belum Divalidasi'}
                                            {item?.status === 'terima' && 'Diterima'}
                                            {item?.status === 'tolak' && 'Ditolak'}
                                            {item?.status === 'tunggu' && 'Revisi Diajukan'}
                                        </div>
                                    </TableCell>
                                    <TableCell className='border border-slate-200'>
                                        {item?.keterangan ?? "-"}
                                    </TableCell>
                                    <TableCell className='border border-slate-200'>
                                        <div className="flex items-center justify-center gap-4">
                                            <Link
                                                className={`px-4 py-2 rounded-lg text-white ${item.status === 'tolak' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                                href={item.status === 'tolak' ? `/korluh/palawija` : '#'} // Disable link jika status bukan 'tolak'
                                                onClick={(e) => {
                                                    if (item.status !== 'tolak') {
                                                        e.preventDefault(); // Mencegah navigasi jika link dinonaktifkan
                                                    }
                                                }}
                                            >
                                                Perbaikan
                                            </Link>
                                            <AjukanKembali
                                                id={item.id}        // ID dari item
                                                status={item.status} // Status dari item (misalnya 'tolak', 'terima', dll)
                                                onAjukanKembali={handleAjukanKembaliFunction} // Fungsi untuk handle API
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                <NotFoundSearch />
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>
            {/* table */}
            
        </div>
    )
}

export default StatusLaporanPalawija