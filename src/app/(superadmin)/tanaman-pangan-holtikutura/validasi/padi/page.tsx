"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../../public/icons/EyeIcon'
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Calendar as CalendarIcon, Filter } from "lucide-react"
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
import VerifikasiIcon from '../../../../../../public/icons/VerifikasiIcon';
import TolakIcon from '../../../../../../public/icons/TolakIcon';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';
import KecamatanKorluhPrint from '@/components/Print/BPPKecamatan/Padi';
import KecamatanKorluhPadiPrint from '@/components/Print/BPPKecamatan/Padi';
import TambahIcon from '../../../../../../public/icons/TambahIcon';
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun';
import Label from '@/components/ui/label';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
const ValidasiPadi = () => {
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
        keterangan: string;
        kecamatanId: any;
        kecamatan: string;
        status: string;
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
        `/validasi/korluh-padi/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`,
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
            await axiosPrivate.post("/validasi/korluh-padi/set", payload);
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
        mutate(`/validasi/korluh-padi/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
    };

    // Fungsi untuk mengirim data ke API
    const handleVerifikasi = async (payload: { kecamatan_id: number; bulan: string; status: string }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-padi/set", payload);
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
        mutate(`/validasi/korluh-padi/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
    };

    // validasi
    const getValidationText = (validasi: any) => {
        switch (validasi) {
            case 'terima':
                return 'Sudah divalidasi';
            case 'tolak':
                return 'Validasi ditolak, menunggu revisi';
            case 'tunggu':
                return 'Sudah direvisi, menunggu divalidasi';
            case 'belum':
                return 'Belum divalidasi';
            default:
                return 'Status tidak diketahui';
        }
    };
    const validationText = getValidationText(dataPadi?.data?.status);
    // validasi


    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Validasi Padi</div>
            {/* title */}

            {/* desktop */}
            <div className="hidden md:block">
                {/* top */}
                <div className="header flex gap-2 justify-end items-center mt-4">
                    <div className="btn flex gap-2">
                        {/* <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Print
                        </div>
                    </Button> */}
                        <KecamatanKorluhPadiPrint
                            urlApi={`/validasi/korluh-padi/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`}
                            kecamatan={selectedKecamatan}
                            bulan={bulan}
                            tahun={tahun}
                        />
                    </div>
                </div>
                {/* top */}
                {/*  */}
                <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                    <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                        <div className="w-[80px]">
                            <TahunSelect
                                url='korluh/master-tahun/padi'
                                // semua={true}
                                value={tahun}
                                onChange={(value) => {
                                    setTahun(value);
                                }}
                            />
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
                        <div className="w-[230px]">
                            <KecamatanSelectNo
                                value={selectedKecamatan}
                                onChange={(value) => {
                                    setSelectedKecamatan(value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                        <Link href={`/tanaman-pangan-holtikutura/validasi/padi/detail/${selectedKecamatan}/${tahun}/${bulan}`} className='bg-blue-500 px-3 py-3 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                            Detail
                        </Link>
                        <Link href="/tanaman-pangan-holtikutura/validasi/padi/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                        <div className="">
                            Keterangan
                        </div>
                    </div>
                    <div className="font-semibold">
                        <div className="">:</div>
                        <div className="">:</div>
                        <div className="">:</div>
                        <div className="">:</div>
                        <div className="">:</div>
                    </div>
                    <div className="bulan">
                        <div className="">{dataPadi?.data?.kecamatan ?? "-"}</div>
                        <div className="">{monthName ?? "-"} {dataPadi?.data?.tahun ?? "-"}</div>
                        <div className="capitalize">{validationText ?? "-"}</div>
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
                        <div className="text-justify">{dataPadi?.data?.keterangan ?? "-"}</div>
                    </div>
                </div>
            </div>
            {/* desktop */}

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* Handle filter menu*/}
                    <div className="flex justify-between w-full mt-4">
                        <div className="flex justify-start w-fit gap-2">
                            {/* More Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outlinePrimary"
                                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                                    >
                                        <Filter className="text-primary w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md ml-5 w-[280px]">
                                    <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                                        Menu Filter
                                    </DropdownMenuLabel>
                                    {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                    <div className="bg-white w-full h-full">
                                        <div className="flex flex-col w-full px-2 py-2">
                                            {/* Filter Kecamatan */}
                                            <Label className='text-xs mb-1 !text-black opacity-50' label="Pilih Kecamatan" />
                                            <div className="w-full mb-2">
                                                <KecamatanSelect
                                                    value={selectedKecamatan}
                                                    onChange={(value) => {
                                                        setSelectedKecamatan(value);
                                                    }}
                                                />
                                            </div>
                                            {/* Filter Kecamatan */}

                                            {/* Filter Desa */}
                                            {/* Filter Desa */}

                                            {/* Filter Rentang Tanggal */}
                                            {/* Filter Rentang Tanggal */}

                                            {/* Filter Tahun Bulan */}
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Bulan" />
                                                <div className="flex gap-2 justify-between items-center w-full">
                                                    {/* filter tahun */}
                                                    <TahunSelect
                                                        url='korluh/master-tahun/padi'
                                                        // semua={true}
                                                        value={tahun}
                                                        onChange={(value) => {
                                                            setTahun(value);
                                                        }}
                                                    />
                                                    -
                                                    {/* filter tahun */}
                                                    {/* Filter bulan */}
                                                    <div className="w-full">
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
                                                    {/* Filter bulan */}
                                                </div>
                                            </>
                                            {/* Filter Tahun Bulan */}

                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* More Menu */}

                            {/* unduh print */}
                            {/* <TPHPalawija1
                                urlApi={`/tph/realisasi-palawija-1/get?bulan=${selectedTahun}/${bulan}&kecamatan=${selectedKecamatan}`}
                                kecamatan={selectedKecamatan}
                                tahun={selectedTahun}
                                bulan={bulan}
                            /> */}
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit gap-2">
                            <Link href={`/tanaman-pangan-holtikutura/validasi/padi/detail/${selectedKecamatan}/${tahun}/${bulan}`} className='bg-blue-500 px-4 py-2 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                                Detail
                            </Link>
                            <Link
                                href="/tanaman-pangan-holtikutura/validasi/padi/tambah"
                                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                                {/* Tambah */}
                                <TambahIcon />
                            </Link>
                        </div>
                        {/* Tambah Data */}
                    </div>

                    {/* Hendle Search */}
                    {/* <div className="mt-2 search w-full">
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Cari"
                            value={search}
                            onChange={handleSearchChange}
                            rightIcon={<SearchIcon />}
                            className='border-primary py-2 text-xs'
                        />
                    </div> */}
                    {/* Hendle Search */}

                </>
                <div className="card-table text-xs p-3 rounded-2xl border border-primary bg-white shadow-sm mt-4">
                    {/* keterangan */}
                    <div className="keterangan flex gap-2">
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
                            <div className="mt-1">
                                Keterangan
                            </div>
                        </div>
                        <div className="font-semibold">
                            <div className="">:</div>
                            <div className="">:</div>
                            <div className="">:</div>
                            <div className="">:</div>
                            <div className="mt-1">:</div>
                        </div>
                        <div className="bulan">
                            <div className="">{dataPadi?.data?.kecamatan ?? "-"}</div>
                            <div className="">{monthName ?? "-"} {dataPadi?.data?.tahun ?? "-"}</div>
                            <div className="capitalize">{validationText ?? "-"}</div>
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
                            <div className="w-[300px] max-w-[300px] text-justify">{dataPadi?.data?.keterangan ?? "-"}</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile */}

            {/* mobile table */}
            <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
                <div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                    <div className="wrap-konten flex flex-col gap-2">
                        <Carousel>
                            {/* <div className="flex justify-between gap-2 mb-2">
											<CarouselPrevious className='' />
											<CarouselNext className='' />
										</div> */}
                            <CarouselContent>
                                <CarouselItem>
                                    <>
                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    Jumlah Padi
                                                </div>

                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.bulan_lalu_jumlah_padi_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.jumlah_padi_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.jumlah_padi_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">					{dataPadi?.data?.jumlah_padi_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_jumlah_padi_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />

                                        </div>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">1.</div>
                                            <div className="konten text-black/80 text-end">Jenis Padi</div>
                                        </div>
                                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse mt-2 mb-2"></div>
                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    A. Hibrida
                                                </div>

                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">1). Bantuan Pemerintah</div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">					{dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_hibrida_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    2). Non Bantuan Pemerintah
                                                </div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                      {dataPadi?.data?.bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">						{dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_hibrida_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    B. Unggul (Non Hibrida)
                                                </div>

                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">1). Bantuan Pemerintah</div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                        {dataPadi?.data?.bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">													{dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">						{dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_unggul_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                      {dataPadi?.data?.bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    2). Non Bantuan Pemerintah
                                                </div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                     {dataPadi?.data?.bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">					{dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_unggul_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                        {dataPadi?.data?.bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    C. Lokal
                                                </div>

                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                     {dataPadi?.data?.bulan_lalu_lokal_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.lokal_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">													{dataPadi?.data?.lokal_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">						{dataPadi?.data?.lokal_lahan_sawah_puso ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_lokal_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                     {dataPadi?.data?.bulan_lalu_lokal_lahan_bukan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.lokal_lahan_bukan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.lokal_lahan_bukan_sawah_tanam ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.lokal_lahan_bukan_sawah_puso ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_lokal_lahan_bukan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                        </div>
                                    </>
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">2.</div>
                                            <div className="konten text-black/80 text-end">Jenis Pengairan</div>
                                        </div>
                                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse mt-2 mb-2"></div>
                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    A. Sawah Irigasi
                                                </div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                    {dataPadi?.data?.bulan_lalu_sawah_irigasi_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.sawah_irigasi_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">	{dataPadi?.data?.sawah_irigasi_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">				{dataPadi?.data?.sawah_irigasi_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_sawah_irigasi_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                        </div>

                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    B. Sawah Tadah Hujan
                                                </div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                     {dataPadi?.data?.bulan_lalu_sawah_tadah_hujan_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">				{dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_sawah_tadah_hujan_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                        </div>

                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    C. Sawah Rawa Pasang Surut
                                                </div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                        {dataPadi?.data?.bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">			{dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_sawah_rawa_pasang_surut_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                        </div>

                                        <div className="">
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">
                                                    D. Sawah Rawa Lebak
                                                </div>
                                                <div className="konten text-black/80 text-end"></div>
                                            </div>
                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Bulan Yang Lalu</div>
                                                <div className="konten text-black/80 text-end">                        {dataPadi?.data?.bulan_lalu_sawah_rawa_lebak_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                <div className="konten text-black/80 text-end">
                                                    {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_panen ??
                                                        "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                <div className="konten text-black/80 text-end">		{dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_tanam ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Lahan Sawah Puso</div>
                                                <div className="konten text-black/80 text-end">			{dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_puso ??
                                                    "-"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="label font-medium text-black">Tanaman Akhir Bulan Laporan</div>
                                                <div className="konten text-black/80 text-end">					 {dataPadi?.data?.akhir_sawah_rawa_lebak_lahan_sawah ?? "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div >
            {/* mobile table */}

            {/* table */}
            <div className="hidden md:block">
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
                                Lahan Bukan Sawah
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
                                    {dataPadi?.data?.bulan_lalu_jumlah_padi_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center'>
                                    {dataPadi?.data?.jumlah_padi_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center'>
                                    {dataPadi?.data?.jumlah_padi_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center'>
                                    {dataPadi?.data?.jumlah_padi_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center'>
                                    {dataPadi?.data?.akhir_jumlah_padi_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center'>
                                    {dataPadi?.data?.bulan_lalu_jumlah_padi_lahan_bukan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className=' font-semibold text-center border border-slate-200'>
                                    {dataPadi?.data?.jumlah_padi_lahan_bukan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center '>
                                    {dataPadi?.data?.jumlah_padi_lahan_bukan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className=' font-semibold text-center border border-slate-200'>
                                    {dataPadi?.data?.jumlah_padi_lahan_bukan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 font-semibold text-center '>
                                    {dataPadi?.data?.akhir_jumlah_padi_lahan_bukan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.hibrida_bantuan_pemerintah_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_hibrida_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                </TableCell>
                                <TableCell className='border border-slate-200 '>
                                    2). Non Bantuan Pemerintah
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.hibrida_non_bantuan_pemerintah_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_hibrida_non_bantuan_pemerintah_lahan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_unggul_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_bantuan_pemerintah_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                </TableCell>
                                <TableCell className='border border-slate-200 '>
                                    2). Non Bantuan Pemerintah
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_unggul_non_bantuan_pemerintah_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_lokal_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.lokal_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.lokal_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.lokal_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_lokal_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.bulan_lalu_lokal_lahan_bukan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.lokal_lahan_bukan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.lokal_lahan_bukan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.lokal_lahan_bukan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {dataPadi?.data?.akhir_lokal_lahan_bukan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_sawah_irigasi_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_irigasi_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_irigasi_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_irigasi_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.akhir_sawah_irigasi_lahan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_sawah_tadah_hujan_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_tadah_hujan_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.akhir_sawah_tadah_hujan_lahan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_rawa_pasang_surut_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.akhir_sawah_rawa_pasang_surut_lahan_sawah ?? "-"}
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
                                    {dataPadi?.data?.bulan_lalu_sawah_rawa_lebak_lahan_sawah ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_panen ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_tanam ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.sawah_rawa_lebak_lahan_sawah_puso ?? "-"}
                                </TableCell>
                                <TableCell className='border text-center border-slate-200'>
                                    {dataPadi?.data?.akhir_sawah_rawa_lebak_lahan_sawah ?? "-"}
                                </TableCell>
                            </TableRow>
                            {/* sawah Rawa Lebak */}
                            {/* Jenis pengairan */}
                        </>
                    </TableBody>
                </Table>
            </div>
            {/* table */}
        </div>
    )
}

export default ValidasiPadi