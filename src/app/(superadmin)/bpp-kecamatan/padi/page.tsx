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
import PaginationTable from '@/components/PaginationTable';
import Swal from 'sweetalert2';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import VerifikasiIcon from '../../../../../public/icons/VerifikasiIcon';
import TolakIcon from '../../../../../public/icons/TolakIcon';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';
const KorlubPadi = () => {
    // INTEGRASI
    interface Response {
        status: number;
        message: string;
        data: KorluhPadiData;
    }

    interface KorluhPadiData {
        bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah: number;
        bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah: number;
        bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah: number;
        bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah: number;
        bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah: number;
        bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah: number;
        bulan_lalu_lokal_lahan_sawah: number;
        bulan_lalu_lokal_lahan_bukan_sawah: number;
        bulan_lalu_sawah_irigasi_lahan_sawah: number;
        bulan_lalu_sawah_tadah_hujan_lahan_sawah: number;
        bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah: number;
        bulan_lalu_sawah_rawa_lebak_lahan_sawah: number;
        bulan_lalu_hibrida_lahan_sawah: number;
        bulan_lalu_unggul_lahan_sawah: number;
        bulan_lalu_unggul_lahan_bukan_sawah: number;
        bulan_lalu_jumlah_padi_lahan_sawah: number;
        bulan_lalu_jumlah_padi_lahan_bukan_sawah: number;
        akhir_hibrida_bantuan_pemerintah_lahan_sawah: number;
        akhir_hibrida_non_bantuan_pemerintah_lahan_sawah: number;
        akhir_unggul_bantuan_pemerintah_lahan_sawah: number;
        akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah: number;
        akhir_unggul_non_bantuan_pemerintah_lahan_sawah: number;
        akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah: number;
        akhir_lokal_lahan_sawah: number;
        akhir_lokal_lahan_bukan_sawah: number;
        akhir_sawah_irigasi_lahan_sawah: number;
        akhir_sawah_tadah_hujan_lahan_sawah: number;
        akhir_sawah_rawa_pasang_surut_lahan_sawah: number;
        akhir_sawah_rawa_lebak_lahan_sawah: number;
        akhir_hibrida_lahan_sawah: number;
        akhir_unggul_lahan_sawah: number;
        akhir_unggul_lahan_bukan_sawah: number;
        akhir_jumlah_padi_lahan_sawah: number;
        akhir_jumlah_padi_lahan_bukan_sawah: number;
        bulan: number;
        tahun: number;
        kecamatanId: any;
        kecamatan: string;
        validasiKecamatan: string;
        validasiKabupaten: string;
        hibrida_bantuan_pemerintah_lahan_sawah_panen: number;
        hibrida_bantuan_pemerintah_lahan_sawah_tanam: number;
        hibrida_bantuan_pemerintah_lahan_sawah_puso: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_panen: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_puso: number;
        unggul_bantuan_pemerintah_lahan_sawah_panen: number;
        unggul_bantuan_pemerintah_lahan_sawah_tanam: number;
        unggul_bantuan_pemerintah_lahan_sawah_puso: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_panen: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_tanam: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_puso: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
        lokal_lahan_sawah_panen: number;
        lokal_lahan_sawah_tanam: number;
        lokal_lahan_sawah_puso: number;
        lokal_lahan_bukan_sawah_panen: number;
        lokal_lahan_bukan_sawah_tanam: number;
        lokal_lahan_bukan_sawah_puso: number;
        sawah_irigasi_lahan_sawah_panen: number;
        sawah_irigasi_lahan_sawah_tanam: number;
        sawah_irigasi_lahan_sawah_puso: number;
        sawah_tadah_hujan_lahan_sawah_panen: number;
        sawah_tadah_hujan_lahan_sawah_tanam: number;
        sawah_tadah_hujan_lahan_sawah_puso: number;
        sawah_rawa_pasang_surut_lahan_sawah_panen: number;
        sawah_rawa_pasang_surut_lahan_sawah_tanam: number;
        sawah_rawa_pasang_surut_lahan_sawah_puso: number;
        sawah_rawa_lebak_lahan_sawah_panen: number;
        sawah_rawa_lebak_lahan_sawah_tanam: number;
        sawah_rawa_lebak_lahan_sawah_puso: number;
        hibrida_lahan_sawah_panen: number | null;
        hibrida_lahan_sawah_tanam: number | null;
        hibrida_lahan_sawah_puso: number | null;
        unggul_lahan_sawah_panen: number | null;
        unggul_lahan_sawah_tanam: number | null;
        unggul_lahan_sawah_puso: number | null;
        unggul_lahan_bukan_sawah_panen: number | null;
        unggul_lahan_bukan_sawah_tanam: number | null;
        unggul_lahan_bukan_sawah_puso: number | null;
        jumlah_padi_lahan_sawah_panen: number | null;
        jumlah_padi_lahan_sawah_tanam: number | null;
        jumlah_padi_lahan_sawah_puso: number | null;
        jumlah_padi_lahan_bukan_sawah_panen: number | null;
        jumlah_padi_lahan_bukan_sawah_tanam: number | null;
        jumlah_padi_lahan_bukan_sawah_puso: number | null;
    }


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
    const { data: dataPadi }: SWRResponse<Response> = useSWR(
        // `korluh/padi/get?limit=1`,
        `/validasi/korluh-padi/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`,
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
    const monthNumber = dataPadi?.data?.bulan; // Ambil bulan dari data API
    const monthName = monthNumber ? getMonthName(monthNumber) : "";
    // Bulan

    // handle tolak
    // handle tolak
    // Fungsi untuk mengirim data ke API
    const handleTolak = async (payload: { kecamatan_id: number; bulan: string; status: string; keterangan: string; }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-padi/kec", payload);
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
        mutate(`/validasi/korluh-padi/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
    };

    // Fungsi untuk mengirim data ke API
    const handleVerifikasi = async (payload: { kecamatan_id: number; bulan: string; status: string }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-padi/kec", payload);
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
        mutate(`/validasi/korluh-padi/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
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
    const validationText = getValidationText(dataPadi?.data?.validasiKecamatan);
    // validasi


    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">BPP Kecamatan Padi</div>
            {/* title */}

            {/* top */}
            <div className="header flex gap-2 justify-end items-center mt-4">
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
                    <Link href="/bpp-kecamatan/padi/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                    <div className="">{dataPadi?.data?.kecamatan}</div>
                    <div className="">{monthName} {dataPadi?.data?.tahun}</div>
                    <div className="capitalize">{validationText}</div>
                    <div className="flex gap-3">
                        <VerifikasiPopup
                            kecamatanId={dataPadi?.data?.kecamatanId}
                            bulan={`${dataPadi?.data?.tahun}/${dataPadi?.data?.bulan}`}
                            onVerifikasi={handleVerifikasi}
                        />
                        <TolakPopup
                            kecamatanId={dataPadi?.data?.kecamatanId}
                            bulan={`${dataPadi?.data?.tahun}/${dataPadi?.data?.bulan}`}
                            onTolak={handleTolak}
                        />
                    </div>
                </div>
            </div>
            {/* table */}
            <Table className='border border-slate-200 mt-1'>
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
                            Laha Bukan Sawah
                        </TableHead>
                    </TableRow>
                    <TableRow >
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Bulan Yang Lalu
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanam
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Puso
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Laporan ((3)-(4)+(5)-(6))
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Yang Lalu
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Panen
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanam
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Puso
                        </TableHead>
                        <TableHead className="text-primary border border-slate-200 text-center py-1">
                            Tanaman Akhir Bulan Laporan ((8)-(9)+(10)-(11))
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {/* jumlah padi */}
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                Jumlah Padi
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                            {dataPadi?.data?.bulan_lalu_jumlah_padi_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                {dataPadi?.data?.jumlah_padi_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                {dataPadi?.data?.jumlah_padi_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                {dataPadi?.data?.jumlah_padi_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                {dataPadi?.data?.akhir_jumlah_padi_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                {dataPadi?.data?.bulan_lalu_jumlah_padi_lahan_bukan_sawah}
                            </TableCell>
                            <TableCell className=' font-semibold text-center border border-slate-200'>
                                {dataPadi?.data?.jumlah_padi_lahan_bukan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center '>
                                {dataPadi?.data?.jumlah_padi_lahan_bukan_sawah_tanam}
                            </TableCell>
                            <TableCell className=' font-semibold text-center border border-slate-200'>
                                {dataPadi?.data?.jumlah_padi_lahan_bukan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold text-center '>
                                {dataPadi?.data?.akhir_jumlah_padi_lahan_bukan_sawah}
                            </TableCell>

                        </TableRow>
                        {/* jumlah padi */}
                        {/* jenis padi */}
                        <TableRow>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                1.
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold'>
                                Jenis Padi
                            </TableCell>
                            <TableCell colSpan={10} className='border border-slate-200 font-semibold'>
                            </TableCell>
                        </TableRow>
                        {/* hibrida */}
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold '>
                                A. Hibrida
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 '>
                                1). Bantuan Pemerintah
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_hibrida_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 '>
                                2). Non Bantuan Pemerintah
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_hibrida_non_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* hibrida */}
                        {/* Non hibrida */}
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold '>
                                B. Unggul (Non Hibrida)
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 '>
                                1). Bantuan Pemerintah
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_unggul_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 '>
                                2). Non Bantuan Pemerintah
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_unggul_non_bantuan_pemerintah_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* Non hibrida */}
                        {/* Lokal */}
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold '>
                                C. Lokal
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_lokal_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.lokal_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.lokal_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.lokal_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_lokal_lahan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.bulan_lalu_lokal_lahan_bukan_sawah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.lokal_lahan_bukan_sawah_panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.lokal_lahan_bukan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.lokal_lahan_bukan_sawah_puso}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataPadi?.data?.akhir_lokal_lahan_bukan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* jenis padi */}
                        {/* Jenis pengairan */}
                        <TableRow>
                            <TableCell className='border border-slate-200 font-semibold text-center'>
                                2.
                            </TableCell>
                            <TableCell className='border border-slate-200 font-semibold'>
                                Jenis Pengairan
                            </TableCell>
                        </TableRow>
                        {/* sawah irigasi */}
                        <TableRow>
                            <TableCell className='border border-slate-200'>
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                A. Sawah Irigasi
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.bulan_lalu_sawah_irigasi_lahan_sawah}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_irigasi_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_irigasi_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_irigasi_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.akhir_sawah_irigasi_lahan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* sawah irigasi */}
                        {/* sawah tadah hujan */}
                        <TableRow>
                            <TableCell className='border border-slate-200'>
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                B. Sawah Tadah Hujan
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.bulan_lalu_sawah_tadah_hujan_lahan_sawah}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.akhir_sawah_tadah_hujan_lahan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* sawah tadah hujan */}
                        {/* sawah Rawa Pasang Surut */}
                        <TableRow>
                            <TableCell className='border border-slate-200'>
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                C. Sawah Rawa Pasang Surut
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.akhir_sawah_rawa_pasang_surut_lahan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* sawah Rawa Pasang Surut */}
                        {/* sawah Rawa Lebak */}
                        <TableRow>
                            <TableCell className='border border-slate-200'>
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                D. Sawah Rawa Lebak
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.bulan_lalu_sawah_rawa_lebak_lahan_sawah}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_panen}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_tanam}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_puso}
                            </TableCell>
                            <TableCell className='border text-center border-slate-200'>
                                {dataPadi?.data?.akhir_sawah_rawa_lebak_lahan_sawah}
                            </TableCell>
                        </TableRow>
                        {/* sawah Rawa Lebak */}
                        {/* Jenis pengairan */}
                    </>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default KorlubPadi