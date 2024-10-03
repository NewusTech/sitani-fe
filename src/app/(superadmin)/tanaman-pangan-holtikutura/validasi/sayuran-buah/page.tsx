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
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';
import KecamatanKorluhSayurBuahPrint from '@/components/Print/BPPKecamatan/SayurBuah';
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
import Label from '@/components/ui/label';
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun';
import TambahIcon from '../../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const ValidasiSayuranBuah = () => {
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
    const { data: dataSayuran }: SWRResponse<any> = useSWR(
        `/validasi/korluh-sayur-buah/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`,
        // `/validasi/korluh-sayur-buah/kec?kecamatan=1&bulan=2024/8`,
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
    const monthNumber = dataSayuran?.data?.bulan; // Ambil bulan dari data API
    const monthName = monthNumber ? getMonthName(monthNumber) : "";
    // Bulan

    // handle tolak
    // Fungsi untuk mengirim data ke API
    const handleTolak = async (payload: { kecamatan_id: number; bulan: string; status: string; keterangan: string; }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-sayur-buah/set", payload);
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
        mutate(`/validasi/korluh-sayur-buah/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
    };

    // Fungsi untuk mengirim data ke API
    const handleVerifikasi = async (payload: { kecamatan_id: number; bulan: string; status: string }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-sayur-buah/set", payload);
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
        mutate(`/validasi/korluh-sayur-buah/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
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
    const validationText = getValidationText(dataSayuran?.data?.status);
    // validasi

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Validasi Sayuran Buah</div>
            {/* title */}

            {/* desktop */}
            <div className="hidden md:block">
                {/* top */}
                <div className="header flex gap-2 justify-end items-center mt-4">
                    <div className="btn flex gap-2">
                        <KecamatanKorluhSayurBuahPrint
                            urlApi={`/validasi/korluh-sayur-buah/data?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`}
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
                        <Link href={`/tanaman-pangan-holtikutura/validasi/sayuran-buah/detail/${selectedKecamatan}/${tahun}/${bulan}`} className='bg-blue-500 px-3 py-3 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                            Detail
                        </Link>
                        <Link href="/tanaman-pangan-holtikutura/validasi/sayuran-buah/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                        <div className="">{dataSayuran?.data?.kecamatan}</div>
                        <div className="">{monthName} {dataSayuran?.data?.tahun}</div>
                        <div className="capitalize">{validationText}</div>
                        <div className="flex gap-3">
                            <VerifikasiPopup
                                kecamatanId={dataSayuran?.data?.kecamatanId}
                                bulan={`${dataSayuran?.data?.tahun}/${dataSayuran?.data?.bulan}`}
                                onVerifikasi={handleVerifikasi}
                            />
                            <TolakPopup
                                kecamatanId={dataSayuran?.data?.kecamatanId}
                                bulan={`${dataSayuran?.data?.tahun}/${dataSayuran?.data?.bulan}`}
                                onTolak={handleTolak}
                            />
                        </div>
                        <div className="w-[300px] max-w-[300px] text-justify">{dataSayuran?.data?.keterangan ?? "-"}</div>
                    </div>
                </div>
            </div>

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
                                                <KecamatanSelectNo
                                                    value={selectedKecamatan}
                                                    onChange={(value) => {
                                                        setSelectedKecamatan(value);
                                                    }}
                                                />
                                            </div>
                                            {/* Filter Kecamatan */}

                                            {/* Filter Tahun Bulan */}
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Bulan" />
                                                <div className="flex gap-2 justify-between items-center w-full">
                                                    {/* filter tahun */}
                                                    <TahunSelect
                                                        url='korluh/master-tahun/sayur-buah'
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
                            <Link href={`/tanaman-pangan-holtikutura/validasi/sayuran-buah/detail/${selectedKecamatan}/${tahun}/${bulan}`} className='bg-blue-500 px-4 py-2 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                                Detail
                            </Link>
                            <Link
                                href="/tanaman-pangan-holtikutura/validasi/sayuran-buah/tambah"
                                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                                {/* Tambah */}
                                <TambahIcon />
                            </Link>
                        </div>
                        {/* Tambah Data */}
                    </div>

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
                            <div className="">{dataSayuran?.data?.kecamatan ?? "-"}</div>
                            <div className="">{monthName ?? "-"} {dataSayuran?.data?.tahun ?? "-"}</div>
                            <div className="capitalize">{validationText ?? "-"}</div>
                            <div className="flex gap-3">
                                <VerifikasiPopup
                                    kecamatanId={dataSayuran?.data?.kecamatanId}
                                    bulan={`${dataSayuran?.data?.tahun}/${dataSayuran?.data?.bulan}`}
                                    onVerifikasi={handleVerifikasi}
                                />
                                <TolakPopup
                                    kecamatanId={dataSayuran?.data?.kecamatanId}
                                    bulan={`${dataSayuran?.data?.tahun}/${dataSayuran?.data?.bulan}`}
                                    onTolak={handleTolak}
                                />
                            </div>
                            <div className=" text-justify">{dataSayuran?.data?.keterangan ?? "-"}</div>
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
                            <CarouselContent>
                                <CarouselItem>
                                    {/* Bawang Dauh */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">A.1</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>

                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bawang Daun</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[1]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[1]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[1]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[1]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[1]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[1]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[1]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[1]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[1]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[1]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[1]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Bawang Merah */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">2.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bawang Merah</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[2]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[2]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[2]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[2]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[2]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[2]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[2]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[2]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[2]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[2]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[2]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Bawang Putih */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">3. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bawang Putih</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[3]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[3]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[3]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[3]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[3]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[3]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[3]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[3]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[3]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[3]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[3]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Kembang Kol */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">4. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kembang Kol</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[4]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[4]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[4]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[4]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[4]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[4]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[4]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[4]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[4]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[4]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[4]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Kentang */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">5. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bawang Daun</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[5]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[5]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[5]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[5]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[5]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[5]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[5]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[5]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[5]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[5]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[5]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Kubis */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">6. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kubis</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[6]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[6]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[6]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[6]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[6]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[6]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[6]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[6]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[6]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[6]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[6]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Petsai/Sawi */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">7. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bawang Daun</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[7]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[7]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[7]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[7]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[7]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[7]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[7]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[7]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[7]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[7]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[7]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Wortel */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">8. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Wortel</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[8]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[8]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[8]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[8]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[8]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[8]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[8]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[8]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[8]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[8]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[8]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Bayam */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">9. </div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bayam</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[9]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[9]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[9]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[9]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[9]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[9]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[9]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[9]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[9]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[9]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[9]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Buncis */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">10.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Buncis</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[10]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[10]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[10]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[10]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[10]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[10]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[10]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[10]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[10]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[10]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[10]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Cabai Besar TW/Teropong */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">11.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Cabai Besar TW/Teropong</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[11]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[11]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[11]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[11]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[11]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[11]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[11]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[11]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[11]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[11]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[11]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Cabai Keriting */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">12.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Cabai Keriting</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[12]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[12]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[12]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[12]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[12]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[12]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[12]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[12]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[12]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[12]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[12]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Cabai Rawit */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">13.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Cabai Rawit</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[13]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[13]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[13]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[13]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[13]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[13]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[13]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[13]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[13]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[13]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[13]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Jamur Tiram */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">14</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jamur Tiram</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[14]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[14]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[14]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[14]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[14]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[14]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[14]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[14]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[14]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[14]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[14]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Jamur Merang */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">15</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jamur Merang</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[15]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[15]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[15]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[15]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[15]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[15]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[15]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[15]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[15]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[15]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[15]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Jamur Lainnya */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">16.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jamur Lainnya</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[16]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[16]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[16]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[16]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[16]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[16]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[16]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[16]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[16]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[16]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[16]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Kacang Panjang */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">17.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kacang Panjang</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[17]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[17]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[17]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[17]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[17]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[17]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[17]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[17]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[17]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[17]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[17]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Kangkung */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">18.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kangkung</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[18]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[18]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[18]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[18]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[18]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[18]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[18]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[18]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[18]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[18]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[18]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Mentimun */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">19.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mentimun</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[19]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[19]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[19]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[19]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[19]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[19]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[19]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[19]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[19]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[19]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[19]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Labu Siam*/}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">20.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Labu Siam</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[20]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[20]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[20]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[20]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[20]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[20]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[20]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[20]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[20]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[20]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[20]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Paprika */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">21.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Paprika</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[21]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[21]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[21]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[21]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[21]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[21]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[21]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[21]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[21]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[21]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[21]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Terung */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">22.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Terung</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[22]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[22]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[22]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[22]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[22]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[22]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[22]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[22]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[22]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[22]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[22]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Tomat */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">23.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Tomat</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[23]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[23]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[23]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[23]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[23]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[23]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[23]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[23]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[23]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[23]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[23]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Melon */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">B1.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Melon</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[24]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[24]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[24]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[24]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[24]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[24]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[24]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[24]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[24]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[24]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[24]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Semangka */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">2.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Semangka</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[25]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[25]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[25]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[25]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[25]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[25]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[25]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[25]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[25]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[25]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[25]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Stroberi */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">3.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Stroberi</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Hasil Produksi Yang Dicatat</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[26]?.hasilProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan yang Lalu (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[26]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (Hektar)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[26]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[26]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[26]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[26]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Bulan Laporan (Hektar)</div>
                                                        <div className="konten text-black/80 text-end">
                                                        {dataSayuran?.data[26]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kuintal)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[26]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataSayuran?.data[26]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[26]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataSayuran?.data[26]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
                {/* Umbi lainnya */}
            </div >
            {/* mobile table */}

            {/* table */}
            <div className="hidden md:block">
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
                                    Hasil Produksi Yang dicatat
                                </div>
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                <div className="w-[150px] text-center items-center">
                                    Luas Tanaman Akhir Bulan yang Lalu (Hektar)
                                </div>
                            </TableHead>
                            <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                <div className="text-center items-center">
                                    Luas Panen (Hektar)
                                </div>
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                <div className="w-[150px] text-center items-center">
                                    Luas Rusak / Tidak Berhasil/Puso (Hektar)
                                </div>
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                <div className="w-[150px] text-center items-center">
                                    Luas Penanaman Baru / Tambah Tanam (Hektar)
                                </div>
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                <div className="w-[150px] text-center items-center">
                                    Luas Tanaman Akhir Bulan Laporan (Hektar)  (4)-(5)-(7)+(8)
                                </div>
                            </TableHead>
                            <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Produksi (Kuintal)
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
                        {/* Bawang daun */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                            <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[1]?.rerataHarga && dataSayuran?.data[1]?.count
                                    ? Number.isInteger(dataSayuran?.data[1]?.rerataHarga / dataSayuran?.data[1]?.count)
                                        ? (dataSayuran?.data[1]?.rerataHarga / dataSayuran?.data[1]?.count).toLocaleString()
                                        : (dataSayuran?.data[1]?.rerataHarga / dataSayuran?.data[1]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[1]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Bawang Merah */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">2.</TableCell>
                            <TableCell className="border border-slate-200">Bawang Merah</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[2]?.rerataHarga && dataSayuran?.data[2]?.count
                                    ? Number.isInteger(dataSayuran?.data[2]?.rerataHarga / dataSayuran?.data[2]?.count)
                                        ? (dataSayuran?.data[2]?.rerataHarga / dataSayuran?.data[2]?.count).toLocaleString()
                                        : (dataSayuran?.data[2]?.rerataHarga / dataSayuran?.data[2]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[2]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Bawang Putih */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">3.</TableCell>
                            <TableCell className="border border-slate-200">Bawang Putih</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[3]?.rerataHarga && dataSayuran?.data[3]?.count
                                    ? Number.isInteger(dataSayuran?.data[3]?.rerataHarga / dataSayuran?.data[3]?.count)
                                        ? (dataSayuran?.data[3]?.rerataHarga / dataSayuran?.data[3]?.count).toLocaleString()
                                        : (dataSayuran?.data[3]?.rerataHarga / dataSayuran?.data[3]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[3]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Kembang Kol */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">4.</TableCell>
                            <TableCell className="border border-slate-200">Kembang Kol</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[4]?.rerataHarga && dataSayuran?.data[4]?.count
                                    ? Number.isInteger(dataSayuran?.data[4]?.rerataHarga / dataSayuran?.data[4]?.count)
                                        ? (dataSayuran?.data[4]?.rerataHarga / dataSayuran?.data[4]?.count).toLocaleString()
                                        : (dataSayuran?.data[4]?.rerataHarga / dataSayuran?.data[4]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[4]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Kentang */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">5.</TableCell>
                            <TableCell className="border border-slate-200">Kentang</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[5]?.rerataHarga && dataSayuran?.data[5]?.count
                                    ? Number.isInteger(dataSayuran?.data[5]?.rerataHarga / dataSayuran?.data[5]?.count)
                                        ? (dataSayuran?.data[5]?.rerataHarga / dataSayuran?.data[5]?.count).toLocaleString()
                                        : (dataSayuran?.data[5]?.rerataHarga / dataSayuran?.data[5]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[5]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Kubis */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">6.</TableCell>
                            <TableCell className="border border-slate-200">Kubis</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[6]?.rerataHarga && dataSayuran?.data[6]?.count
                                    ? Number.isInteger(dataSayuran?.data[6]?.rerataHarga / dataSayuran?.data[6]?.count)
                                        ? (dataSayuran?.data[6]?.rerataHarga / dataSayuran?.data[6]?.count).toLocaleString()
                                        : (dataSayuran?.data[6]?.rerataHarga / dataSayuran?.data[6]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[6]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Petsai/Sawi */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">7.</TableCell>
                            <TableCell className="border border-slate-200">Petsai/Sawi</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[7]?.rerataHarga && dataSayuran?.data[7]?.count
                                    ? Number.isInteger(dataSayuran?.data[7]?.rerataHarga / dataSayuran?.data[7]?.count)
                                        ? (dataSayuran?.data[7]?.rerataHarga / dataSayuran?.data[7]?.count).toLocaleString()
                                        : (dataSayuran?.data[7]?.rerataHarga / dataSayuran?.data[7]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[7]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                        {/* Wortel */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">8.</TableCell>
                            <TableCell className="border border-slate-200">Wortel</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[8]?.rerataHarga && dataSayuran?.data[8]?.count
                                    ? Number.isInteger(dataSayuran?.data[8]?.rerataHarga / dataSayuran?.data[8]?.count)
                                        ? (dataSayuran?.data[8]?.rerataHarga / dataSayuran?.data[8]?.count).toLocaleString()
                                        : (dataSayuran?.data[8]?.rerataHarga / dataSayuran?.data[8]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[8]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Bayam */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">9.</TableCell>
                            <TableCell className="border border-slate-200">Bayam</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[9]?.rerataHarga && dataSayuran?.data[9]?.count
                                    ? Number.isInteger(dataSayuran?.data[9]?.rerataHarga / dataSayuran?.data[9]?.count)
                                        ? (dataSayuran?.data[9]?.rerataHarga / dataSayuran?.data[9]?.count).toLocaleString()
                                        : (dataSayuran?.data[9]?.rerataHarga / dataSayuran?.data[9]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[9]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Buncis */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">10.</TableCell>
                            <TableCell className="border border-slate-200">Buncis</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[10]?.rerataHarga && dataSayuran?.data[10]?.count
                                    ? Number.isInteger(dataSayuran?.data[10]?.rerataHarga / dataSayuran?.data[10]?.count)
                                        ? (dataSayuran?.data[10]?.rerataHarga / dataSayuran?.data[10]?.count).toLocaleString()
                                        : (dataSayuran?.data[10]?.rerataHarga / dataSayuran?.data[10]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[10]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Cabai Besar TW/Teropong */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">11.</TableCell>
                            <TableCell className="border border-slate-200">Cabai Besar TW/Teropong</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[11]?.rerataHarga && dataSayuran?.data[11]?.count
                                    ? Number.isInteger(dataSayuran?.data[11]?.rerataHarga / dataSayuran?.data[11]?.count)
                                        ? (dataSayuran?.data[11]?.rerataHarga / dataSayuran?.data[11]?.count).toLocaleString()
                                        : (dataSayuran?.data[11]?.rerataHarga / dataSayuran?.data[11]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[11]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Cabai Keriting */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">12.</TableCell>
                            <TableCell className="border border-slate-200">Cabai Keriting</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[12]?.rerataHarga && dataSayuran?.data[12]?.count
                                    ? Number.isInteger(dataSayuran?.data[12]?.rerataHarga / dataSayuran?.data[12]?.count)
                                        ? (dataSayuran?.data[12]?.rerataHarga / dataSayuran?.data[12]?.count).toLocaleString()
                                        : (dataSayuran?.data[12]?.rerataHarga / dataSayuran?.data[12]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[12]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Cabai Rawit */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">13.</TableCell>
                            <TableCell className="border border-slate-200">Cabai Rawit</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[13]?.rerataHarga && dataSayuran?.data[13]?.count
                                    ? Number.isInteger(dataSayuran?.data[13]?.rerataHarga / dataSayuran?.data[13]?.count)
                                        ? (dataSayuran?.data[13]?.rerataHarga / dataSayuran?.data[13]?.count).toLocaleString()
                                        : (dataSayuran?.data[13]?.rerataHarga / dataSayuran?.data[13]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[13]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Jamur Tiram */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">14.</TableCell>
                            <TableCell className="border border-slate-200">Jamur Tiram</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[14]?.rerataHarga && dataSayuran?.data[14]?.count
                                    ? Number.isInteger(dataSayuran?.data[14]?.rerataHarga / dataSayuran?.data[14]?.count)
                                        ? (dataSayuran?.data[14]?.rerataHarga / dataSayuran?.data[14]?.count).toLocaleString()
                                        : (dataSayuran?.data[14]?.rerataHarga / dataSayuran?.data[14]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[14]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Jamur Merang */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">15.</TableCell>
                            <TableCell className="border border-slate-200">Jamur Merang</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[15]?.rerataHarga && dataSayuran?.data[15]?.count
                                    ? Number.isInteger(dataSayuran?.data[15]?.rerataHarga / dataSayuran?.data[15]?.count)
                                        ? (dataSayuran?.data[15]?.rerataHarga / dataSayuran?.data[15]?.count).toLocaleString()
                                        : (dataSayuran?.data[15]?.rerataHarga / dataSayuran?.data[15]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[15]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Jamur Lainnya */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">16.</TableCell>
                            <TableCell className="border border-slate-200">Jamur Lainnya</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[16]?.rerataHarga && dataSayuran?.data[16]?.count
                                    ? Number.isInteger(dataSayuran?.data[16]?.rerataHarga / dataSayuran?.data[16]?.count)
                                        ? (dataSayuran?.data[16]?.rerataHarga / dataSayuran?.data[16]?.count).toLocaleString()
                                        : (dataSayuran?.data[16]?.rerataHarga / dataSayuran?.data[16]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[16]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Kacang Panjang */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">17.</TableCell>
                            <TableCell className="border border-slate-200">Kacang Panjang</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[17]?.rerataHarga && dataSayuran?.data[17]?.count
                                    ? Number.isInteger(dataSayuran?.data[17]?.rerataHarga / dataSayuran?.data[17]?.count)
                                        ? (dataSayuran?.data[17]?.rerataHarga / dataSayuran?.data[17]?.count).toLocaleString()
                                        : (dataSayuran?.data[17]?.rerataHarga / dataSayuran?.data[17]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[17]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Kangkung */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">18.</TableCell>
                            <TableCell className="border border-slate-200">Kangkung</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[18]?.rerataHarga && dataSayuran?.data[18]?.count
                                    ? Number.isInteger(dataSayuran?.data[18]?.rerataHarga / dataSayuran?.data[18]?.count)
                                        ? (dataSayuran?.data[18]?.rerataHarga / dataSayuran?.data[18]?.count).toLocaleString()
                                        : (dataSayuran?.data[18]?.rerataHarga / dataSayuran?.data[18]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[18]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Mentimun */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">19.</TableCell>
                            <TableCell className="border border-slate-200">Mentimun</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[19]?.rerataHarga && dataSayuran?.data[19]?.count
                                    ? Number.isInteger(dataSayuran?.data[19]?.rerataHarga / dataSayuran?.data[19]?.count)
                                        ? (dataSayuran?.data[19]?.rerataHarga / dataSayuran?.data[19]?.count).toLocaleString()
                                        : (dataSayuran?.data[19]?.rerataHarga / dataSayuran?.data[19]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[19]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Labu Siam */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">20.</TableCell>
                            <TableCell className="border border-slate-200">Labu Siam</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[20]?.rerataHarga && dataSayuran?.data[20]?.count
                                    ? Number.isInteger(dataSayuran?.data[20]?.rerataHarga / dataSayuran?.data[20]?.count)
                                        ? (dataSayuran?.data[20]?.rerataHarga / dataSayuran?.data[20]?.count).toLocaleString()
                                        : (dataSayuran?.data[20]?.rerataHarga / dataSayuran?.data[20]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[20]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Paprika */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">21.</TableCell>
                            <TableCell className="border border-slate-200">Paprika</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[21]?.rerataHarga && dataSayuran?.data[21]?.count
                                    ? Number.isInteger(dataSayuran?.data[21]?.rerataHarga / dataSayuran?.data[21]?.count)
                                        ? (dataSayuran?.data[21]?.rerataHarga / dataSayuran?.data[21]?.count).toLocaleString()
                                        : (dataSayuran?.data[21]?.rerataHarga / dataSayuran?.data[21]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[21]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Terung */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">22.</TableCell>
                            <TableCell className="border border-slate-200">Terung</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[22]?.rerataHarga && dataSayuran?.data[22]?.count
                                    ? Number.isInteger(dataSayuran?.data[22]?.rerataHarga / dataSayuran?.data[22]?.count)
                                        ? (dataSayuran?.data[22]?.rerataHarga / dataSayuran?.data[22]?.count).toLocaleString()
                                        : (dataSayuran?.data[22]?.rerataHarga / dataSayuran?.data[22]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[22]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Tomat */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">23.</TableCell>
                            <TableCell className="border border-slate-200">Tomat</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[23]?.rerataHarga && dataSayuran?.data[23]?.count
                                    ? Number.isInteger(dataSayuran?.data[23]?.rerataHarga / dataSayuran?.data[23]?.count)
                                        ? (dataSayuran?.data[23]?.rerataHarga / dataSayuran?.data[23]?.count).toLocaleString()
                                        : (dataSayuran?.data[23]?.rerataHarga / dataSayuran?.data[23]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[23]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Melon */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">B1.</TableCell>
                            <TableCell className="border border-slate-200">Melon</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[24]?.rerataHarga && dataSayuran?.data[24]?.count
                                    ? Number.isInteger(dataSayuran?.data[24]?.rerataHarga / dataSayuran?.data[24]?.count)
                                        ? (dataSayuran?.data[24]?.rerataHarga / dataSayuran?.data[24]?.count).toLocaleString()
                                        : (dataSayuran?.data[24]?.rerataHarga / dataSayuran?.data[24]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[24]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Semangka */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">2.</TableCell>
                            <TableCell className="border border-slate-200">Semangka</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[25]?.rerataHarga && dataSayuran?.data[25]?.count
                                    ? Number.isInteger(dataSayuran?.data[25]?.rerataHarga / dataSayuran?.data[25]?.count)
                                        ? (dataSayuran?.data[25]?.rerataHarga / dataSayuran?.data[25]?.count).toLocaleString()
                                        : (dataSayuran?.data[25]?.rerataHarga / dataSayuran?.data[25]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[25]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/* Stroberi */}
                        <TableRow>
                            <TableCell className="border border-slate-200 text-center">3.</TableCell>
                            <TableCell className="border border-slate-200">Stroberi</TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.hasilProduksi ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.bulanLalu ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.luasPanenHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.luasPanenBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.luasRusak ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.luasPenanamanBaru ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.akhir ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.produksiHabis ?? "-"}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.produksiBelumHabis ?? "-"}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {dataSayuran?.data[26]?.rerataHarga && dataSayuran?.data[26]?.count
                                    ? Number.isInteger(dataSayuran?.data[26]?.rerataHarga / dataSayuran?.data[26]?.count)
                                        ? (dataSayuran?.data[26]?.rerataHarga / dataSayuran?.data[26]?.count).toLocaleString()
                                        : (dataSayuran?.data[26]?.rerataHarga / dataSayuran?.data[26]?.count).toFixed(2)
                                    : '-'}
                            </TableCell>
                            <TableCell className="border border-slate-200 text-center">
                                {dataSayuran?.data[26]?.keterangan ?? "-"}
                            </TableCell>
                        </TableRow>
                        {/*  */}
                    </TableBody>
                </Table>
            </div>
            {/* table */}
        </div>
    )
}

export default ValidasiSayuranBuah