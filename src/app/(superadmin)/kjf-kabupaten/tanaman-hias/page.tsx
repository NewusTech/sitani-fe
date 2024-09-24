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
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Swal from 'sweetalert2';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';
import VerifikasiKab from '@/components/superadmin/VerifikasiKab';
import TolakKab from '@/components/superadmin/TolakKab';

const KJFTanamanHias = () => {
    // INTEGRASI
    // INTEGRASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("12");

    function getPreviousMonth(): number {
        const now = new Date();
        let month = now.getMonth(); // 0 = January, 11 = December

        if (month === 0) {
            // Jika bulan adalah Januari (0), set bulan ke Desember (11)
            month = 11;
        } else {
            month -= 1;
        }

        return month + 1; // +1 untuk menyesuaikan hasil ke format 1 = Januari
    }

    const previousMonth = getPreviousMonth();

    // filter tahun bulan
    const currentYear = new Date().getFullYear();
    const [tahun, setTahun] = React.useState(`${currentYear}`);
    const [bulan, setBulan] = React.useState(`${previousMonth}`);
    // filter tahun bulan

    // GETALL
    // GETALL
    const { data: dataTanamanHias }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `/validasi/korluh-tanaman-hias/kab?bulan=${tahun}/${bulan}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // Bulan
    function getMonthName(monthNumber: number): string {
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        // Kurangi 1 dari monthNumber karena array dimulai dari indeks 0
        return monthNames[monthNumber - 1] || "Invalid Month";
    }
    const monthNumber = dataTanamanHias?.data?.bulan; // Ambil bulan dari data API
    const monthName = monthNumber ? getMonthName(monthNumber) : "";
    // Bulan

    // handle tolak
    // handle tolak
    // Fungsi untuk mengirim data ke API
    const handleTolak = async (payload: { bulan: string; status: string; keterangan: string; }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-tanaman-hias/kab", payload);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditolak!',
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
            console.log(payload)
            // push
            console.log("Success to validasi Padi:");
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menolak data!';
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
        } finally {
            // setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/validasi/korluh-tanaman-hias/kab?bulan=${tahun}/${bulan}`);
    };

    // Fungsi untuk mengirim data ke API
    const handleVerifikasi = async (payload: { bulan: string; status: string }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-tanaman-hias/kab", payload);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil divalidasi!',
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
            console.log(payload)
            // push
            console.log("Success to validasi Padi:");
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memvalidasi data!';
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
        } finally {
            // setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/validasi/korluh-tanaman-hias/kab?bulan=${tahun}/${bulan}`);
    };

    // validasi
    const getValidationText = (validasi: any) => {
        switch (validasi) {
            case 'terima':
                return 'Sudah divalidasi';
            case 'tolak':
                return 'Validasi ditolak';
            case 'belum':
                return 'Belum divalidasi';
            default:
                return 'Status tidak diketahui';
        }
    };
    const validationText = getValidationText(dataTanamanHias?.data?.validasiKabupaten);
    // validasi

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">KJF Kabupaten Tanaman Hias</div>
            {/* title */}

            {/* top */}
            {/*  */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                    <div className="w-[80px]">
                        <Select
                            onValueChange={(value) => setTahun(value)}
                            value={tahun}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tahun" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2017">2017</SelectItem>
                                <SelectItem value="2018">2018</SelectItem>
                                <SelectItem value="2019">2019</SelectItem>
                                <SelectItem value="2020">2020</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="">-</div>
                    <div className="w-[130px]">
                        <Select
                            onValueChange={(value) => setBulan(value)}
                            value={bulan}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Bulan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Januari</SelectItem>
                                <SelectItem value="2">Februari</SelectItem>
                                <SelectItem value="3">Maret</SelectItem>
                                <SelectItem value="4">April</SelectItem>
                                <SelectItem value="5">Mei</SelectItem>
                                <SelectItem value="6">Juni</SelectItem>
                                <SelectItem value="7">Juli</SelectItem>
                                <SelectItem value="8">Agustus</SelectItem>
                                <SelectItem value="9">September</SelectItem>
                                <SelectItem value="10">Oktober</SelectItem>
                                <SelectItem value="11">November</SelectItem>
                                <SelectItem value="12">Desember</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* <div className="w-[40px] h-[40px]">
                        <FilterTable
                            columns={columns}
                            defaultCheckedKeys={getDefaultCheckedKeys()}
                            onFilterChange={handleFilterChange}
                        />
                    </div> */}
                </div>
                <div className="btn flex gap-2">
                    {/* <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
                    </Button> */}
                </div>
            </div>
            {/* top */}
            {/* keterangan */}
            <div className="keterangan flex gap-2 mt-2">
                <div className="nama font-semibold">
                    <div className="">
                        Tanggal
                    </div>
                    <div className="">
                        Status
                    </div>
                    <div className="">
                        Validasi
                    </div>
                    <div className="">
                        Keterangan
                    </div>
                </div>
                <div className="font-semibold">
                    <div className="">:</div>
                    <div className="">:</div>
                    <div className="">:</div>
                    <div className="">:</div>
                </div>
                <div className="bulan">
                    <div className="">{monthName ?? "-"} {dataTanamanHias?.data?.tahun ?? "-"}</div>
                    <div className="capitalize">{validationText ?? "-"}</div>
                    <div className="flex gap-3">
                        <VerifikasiKab
                            bulan={`${dataTanamanHias?.data?.tahun}/${dataTanamanHias?.data?.bulan}`}
                            onVerifikasi={handleVerifikasi}
                        />
                        <TolakKab
                            bulan={`${dataTanamanHias?.data?.tahun}/${dataTanamanHias?.data?.bulan}`}
                            onTolak={handleTolak}
                        />
                    </div>
                    <div className="w-[300px] max-w-[300px] text-justify">{dataTanamanHias?.data?.keteranganKabupaten ?? "-"}</div>
                </div>
            </div>

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="text-center items-center">
                                Nama Tanaman
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Tanaman Akhir Triwulan Yang Lalu (m2)
                            </div>
                        </TableHead>
                        <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            <div className="text-center items-center">
                                Luas Panen (m2)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Rusak / Tidak Berhasil / Puso (m2)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Penanaman Baru / Tambah Tanam (m2)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Tanaman Akhir Triwulan Laporan (m2)  (3)-(4)-(6)+(7)
                            </div>
                        </TableHead>
                        <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produksi
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Satuan Produksi
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Keterangan
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Habis / <br /> Dibongkar
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Belum Habis
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Dipanen Habis / Dibongkar
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Belum Habis
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Anggrek Potong */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            1.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Anggrek Potong
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[1]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.count
                                ? (dataTanamanHias?.data[1]?.rerataHarga / dataTanamanHias?.data[1]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[1]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Gerbera (Herbras) */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            2.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Gerbera (Herbras)
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[2]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.count
                                ? (dataTanamanHias?.data[2]?.rerataHarga / dataTanamanHias?.data[2]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[2]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Krisan */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            3.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Krisan
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[3]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.count
                                ? (dataTanamanHias?.data[3]?.rerataHarga / dataTanamanHias?.data[3]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[3]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Mawar */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            4.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Mawar
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[4]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.count
                                ? (dataTanamanHias?.data[4]?.rerataHarga / dataTanamanHias?.data[4]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[4]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Sedap Malam */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            5.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Sedap Malam
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[5]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.count
                                ? (dataTanamanHias?.data[5]?.rerataHarga / dataTanamanHias?.data[5]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[5]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Aglaonema */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            6.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Aglaonema
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[6]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.count
                                ? (dataTanamanHias?.data[6]?.rerataHarga / dataTanamanHias?.data[6]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[6]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Anggrek Pot** */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            7.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Anggrek Pot**
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[7]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.count
                                ? (dataTanamanHias?.data[7]?.rerataHarga / dataTanamanHias?.data[7]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[7]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Anthurium Bunga */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            8.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Anthurium Bunga
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[8]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.count
                                ? (dataTanamanHias?.data[8]?.rerataHarga / dataTanamanHias?.data[8]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[8]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Bromelia */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            9.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Bromelia
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[9]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.count
                                ? (dataTanamanHias?.data[9]?.rerataHarga / dataTanamanHias?.data[9]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[9]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Bugenvil */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            10.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Bugenvil
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[10]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.count
                                ? (dataTanamanHias?.data[10]?.rerataHarga / dataTanamanHias?.data[10]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[10]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Cordyline */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            11.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Cordyline
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[11]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.count
                                ? (dataTanamanHias?.data[11]?.rerataHarga / dataTanamanHias?.data[11]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[11]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Dracaena */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            12.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Dracaena
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[12]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.count
                                ? (dataTanamanHias?.data[12]?.rerataHarga / dataTanamanHias?.data[12]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[12]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Heliconia (Pisang-pisangan) */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            13.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Heliconia (Pisang-pisangan)
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[13]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.count
                                ? (dataTanamanHias?.data[13]?.rerataHarga / dataTanamanHias?.data[13]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[13]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Ixora (Soka) */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            14.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Ixora (Soka)
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[14]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.count
                                ? (dataTanamanHias?.data[14]?.rerataHarga / dataTanamanHias?.data[14]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[14]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Pakis */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            15.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Pakis
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[15]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.count
                                ? (dataTanamanHias?.data[15]?.rerataHarga / dataTanamanHias?.data[15]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[15]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Palem */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            16.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Palem
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[16]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.count
                                ? (dataTanamanHias?.data[16]?.rerataHarga / dataTanamanHias?.data[16]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[16]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Phylodendron */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            17.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Phylodendron
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[17]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.count
                                ? (dataTanamanHias?.data[17]?.rerataHarga / dataTanamanHias?.data[17]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[17]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Puring */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            18.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Puring
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[18]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.count
                                ? (dataTanamanHias?.data[18]?.rerataHarga / dataTanamanHias?.data[18]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[18]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Sansevierie (Lidah mertua) */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            19.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Sansevierie (Lidah mertua)
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[19]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.count
                                ? (dataTanamanHias?.data[19]?.rerataHarga / dataTanamanHias?.data[19]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[19]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                    {/* Melati */}
                    <TableRow>
                        <TableCell className='border border-slate-200 text-center'>
                            20.
                        </TableCell>
                        <TableCell className='border border-slate-200'>
                            Melati
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.bulanLalu ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.luasPanenHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.luasPanenBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.luasRusak ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.luasPenanamanBaru ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.akhir ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.produksiHabis ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.produksiBelumHabis ?? "-"}
                        </TableCell>
                        <TableCell className='text-center border border-slate-200'>
                            {dataTanamanHias?.data[20]?.satuanProduksi ?? "-"}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.count
                                ? (dataTanamanHias?.data[20]?.rerataHarga / dataTanamanHias?.data[20]?.count).toFixed(2)
                                : '-'}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataTanamanHias?.data[20]?.keterangan ?? "-"}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default KJFTanamanHias