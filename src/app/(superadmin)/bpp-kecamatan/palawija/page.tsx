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
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';


const KorluPalawija = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

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
    const { data: dataPalawija }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `/validasi/korluh-palawija/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`,
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
    const monthNumber = dataPalawija?.data?.bulan; // Ambil bulan dari data API
    const monthName = monthNumber ? getMonthName(monthNumber) : "";
    // Bulan

    // handle tolak
    // Fungsi untuk mengirim data ke API
    const handleTolak = async (payload: { kecamatan_id: number; bulan: string; status: string; keterangan: string; }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-palawija/kec", payload);
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
        mutate(`/validasi/korluh-palawija/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
    };

    // Fungsi untuk mengirim data ke API
    const handleVerifikasi = async (payload: { kecamatan_id: number; bulan: string; status: string }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-palawija/kec", payload);
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
        mutate(`/validasi/korluh-palawija/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
    };

    // validasi
    const getValidationText = (validasi:any) => {
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
    const validationText = getValidationText(dataPalawija?.data?.validasi);
    // validasi
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">BPP Kecamatan Palawija</div>
            {/* title */}

            {/* top */}
            <div className="header flex gap-2 justify-end items-center mt-4">
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Print
                        </div>
                    </Button>
                </div>
            </div>
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
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <div className="w-[230px]">
                        <KecamatanSelectNo
                            value={selectedKecamatan}
                            onChange={(value) => {
                                setSelectedKecamatan(value);
                            }}
                        />
                    </div>
                    <Link href="/bpp-kecamatan/palawija/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* keterangan */}
            <div className="keterangan flex gap-2 mt-2">
                <div className="nama font-semibold">
                    <div className="">
                        Kecamatan
                    </div>
                    <div className="">
                        Tanggal
                    </div>
                    <div className="">
                        Status
                    </div>
                    <div className="">
                        Validasi
                    </div>
                </div>
                <div className="font-semibold">
                    <div className="">:</div>
                    <div className="">:</div>
                    <div className="">:</div>
                    <div className="">:</div>
                </div>
                <div className="bulan">
                    <div className="">{dataPalawija?.data?.kecamatan}</div>
                    <div className="">{monthName} {dataPalawija?.data?.tahun}</div>
                    <div className="capitalize">{validationText}</div>
                    <div className="flex gap-3">
                        <VerifikasiPopup
                            kecamatanId={dataPalawija?.data?.kecamatanId}
                            bulan={`${dataPalawija?.data?.tahun}/${dataPalawija?.data?.bulan}`}
                            onVerifikasi={handleVerifikasi}
                        />
                        <TolakPopup
                            kecamatanId={dataPalawija?.data?.kecamatanId}
                            bulan={`${dataPalawija?.data?.tahun}/${dataPalawija?.data?.bulan}`}
                            onTolak={handleTolak}
                        />
                    </div>
                </div>
            </div>

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
                        <TableHead colSpan={7} className="text-primary border border-slate-200 text-center py-1">
                            Lahan Sawah
                        </TableHead>
                        <TableHead colSpan={7} className="text-primary border border-slate-200 text-center py-1">
                            Lahan Bukan Sawah
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                            Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)
                        </TableHead>
                    </TableRow>
                    <TableRow >
                        {/* Lahan Sawah */}
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Yang Lalu
                        </TableHead>
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
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Laporan ((3)-(4)-(5)-(6)+(7)-(8))
                        </TableHead>
                        {/* Lahan Bukan Sawah */}
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Yang Lalu
                        </TableHead>
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
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Laporan ((3)-(4)-(5)-(6)+(7)-(8))
                        </TableHead>

                    </TableRow>
                    <TableRow >
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (1)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (2)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (3)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (4)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (5)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (6)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (7)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (8)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (9)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (10)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (11)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (12)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (13)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (14)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (15)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (16)
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            (17)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* jumlah jagung */}
                    <TableRow>
                        <TableCell>
                            1.
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold text-center'>
                            Jumlah Jagung
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[17]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            A. Hibrida
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[18]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            1). Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[1]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            2). Non Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[2]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            B. Komplit
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[3]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 font-semibold '>
                            C. Lokal
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[4]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[19]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[19]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[5]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[5]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            b. Non Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[6]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[7]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[7]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[20]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[20]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[8]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[8]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        </TableCell>
                        <TableCell className='border border-slate-200 '>
                            b. Non Bantuan Pemerintah
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[9]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[10]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[10]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[11]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[11]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[12]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[12]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[13]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[13]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[14]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[14]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[15]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[15]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
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
                            {dataPalawija?.data[16]?.bulanLaluLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.akhirLahanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.bulanLaluLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanBukanSawahPanen}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanBukanSawahPanenMuda}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanBukanSawahPanenHijauanPakanTernak}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanBukanSawahTanam}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.lahanBukanSawahPuso}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            {dataPalawija?.data[16]?.akhirLahanBukanSawah}
                        </TableCell>
                        <TableCell className='border border-slate-200 text-center'>
                            produksi belum ada
                        </TableCell>
                    </TableRow>
                    {/* Umbi lainnya */}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            {/* <div className="pagination md:mb-[0px] mb-[110px] flex md:justify-end justify-center">
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
            </div> */}
            {/* pagination */}
        </div>
    )
}

export default KorluPalawija