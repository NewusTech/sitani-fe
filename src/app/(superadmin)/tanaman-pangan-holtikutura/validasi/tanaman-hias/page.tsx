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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Label from '@/components/ui/label';
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun';
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
import TolakTPH from '@/components/superadmin/TolakKab';
import VerifikasiKab from '@/components/superadmin/VerifikasiKab';
import { Filter } from 'lucide-react';
import TambahIcon from '../../../../../../public/icons/TambahIcon';

const ValidasiTanamanHias = () => {
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
    const [triwulan, setTriwulan] = React.useState(`1`);
    // filter tahun bulan

    // GETALL
    const { data: dataTanamanHias }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `/validasi/korluh-tanaman-hias/data?kecamatan=${selectedKecamatan}&tahun=${tahun}&triwulan=${triwulan}`,
        // `/validasi/korluh-tanaman-hias/kec?kecamatan=1&bulan=2024/9`,
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
    // Fungsi untuk mengirim data ke API
    const handleTolak = async (payload: { kecamatan_id: number; triwulan: string; tahun: string; status: string; keterangan: string; }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-tanaman-hias/set", payload);
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
        mutate(`/validasi/korluh-tanaman-hias/data?kecamatan=${selectedKecamatan}&tahun=${tahun}&triwulan=${triwulan}`);
    };

    // Fungsi untuk mengirim data ke API
    const handleVerifikasi = async (payload: { kecamatan_id: number; triwulan: string; tahun: string; status: string }) => {
        try {
            await axiosPrivate.post("/validasi/korluh-tanaman-hias/set", payload);
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
        mutate(`/validasi/korluh-tanaman-hias/data?kecamatan=${selectedKecamatan}&tahun=${tahun}&triwulan=${triwulan}`);
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
    const validationText = getValidationText(dataTanamanHias?.data?.status);
    // validasi

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Validasi Tanaman Hias</div>
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
                    </div>
                </div>
                {/* top */}
                {/*  */}
                <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                    <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                        <div className="w-[80px]">
                            <TahunSelect
                                url='korluh/master-tahun/tanaman-hias'
                                // semua={true}
                                value={tahun}
                                onChange={(value) => {
                                    setTahun(value);
                                }}
                            />
                        </div>
                        <div className="">-</div>
                        <div className="w-[200px]">
                            <Select
                                onValueChange={(value) => setTriwulan(value)}
                                value={triwulan}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Triwulan" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="text-primary font-semibold text-center">Pilih Triwulan</div>
                                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                    <SelectItem value="1">Januari - Maret</SelectItem>
                                    <SelectItem value="2">April - Juni</SelectItem>
                                    <SelectItem value="3">Juli - September</SelectItem>
                                    <SelectItem value="4">Oktober - Desember</SelectItem>
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
                        <Link href={`/tanaman-pangan-holtikutura/validasi/tanaman-hias/detail/${selectedKecamatan}/${tahun}/${triwulan}`} className='bg-blue-500 px-3 py-3 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                            Detail
                        </Link>
                        <Link href="/tanaman-pangan-holtikutura/validasi/tanaman-hias/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                        <div className="">{dataTanamanHias?.data?.kecamatan ?? "-"}</div>
                        <div className="">{monthName} {dataTanamanHias?.data?.tahun ?? "-"}</div>
                        <div className="capitalize">{validationText ?? "-"}</div>
                        <div className="flex gap-3">
                            <VerifikasiKab
                                kecamatanId={dataTanamanHias?.data?.kecamatanId}
                                triwulan={dataTanamanHias?.data?.triwulan}
                                tahun={dataTanamanHias?.data?.tahun}
                                onVerifikasi={handleVerifikasi}
                            />
                            <TolakTPH
                                kecamatanId={dataTanamanHias?.data?.kecamatanId}
                                triwulan={dataTanamanHias?.data?.triwulan}
                                tahun={dataTanamanHias?.data?.tahun}
                                onTolak={handleTolak}
                            />
                        </div>
                        <div className="w-[300px] max-w-[300px] text-justify">{dataTanamanHias?.data?.keterangan ?? "-"}</div>
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
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Triwulan" />
                                                <div className="flex gap-2 justify-between items-center w-full">
                                                    {/* filter tahun */}
                                                    <TahunSelect
                                                        url='korluh/master-tahun/tanaman-hias'
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
                                                            onValueChange={(value) => setTriwulan(value)}
                                                            value={triwulan}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Triwulan" className='text-2xl' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <div className="text-primary font-semibold text-center">Pilih Triwulan</div>
                                                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                                                <SelectItem value="1">Januari - Maret</SelectItem>
                                                                <SelectItem value="2">April - Juni</SelectItem>
                                                                <SelectItem value="3">Juli - September</SelectItem>
                                                                <SelectItem value="4">Oktober - Desember</SelectItem>
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
                            <Link href={`/tanaman-pangan-holtikutura/validasi/tanaman-hias/detail/${selectedKecamatan}/${tahun}/${triwulan}`} className='bg-blue-500 px-4 py-2 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                                Detail
                            </Link>
                            <Link
                                href="/tanaman-pangan-holtikutura/validasi/tanaman-hias/tambah"
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
                            <div className="">{dataTanamanHias?.data?.kecamatan ?? "-"}</div>
                            <div className="">{monthName ?? "-"} {dataTanamanHias?.data?.tahun ?? "-"}</div>
                            <div className="capitalize">{validationText ?? "-"}</div>
                            <div className="flex gap-3">
                                <VerifikasiKab
                                    kecamatanId={dataTanamanHias?.data?.kecamatanId}
                                    triwulan={dataTanamanHias?.data?.triwulan}
                                    tahun={dataTanamanHias?.data?.tahun}
                                    onVerifikasi={handleVerifikasi}
                                />
                                <TolakTPH
                                    kecamatanId={dataTanamanHias?.data?.kecamatanId}
                                    triwulan={dataTanamanHias?.data?.triwulan}
                                    tahun={dataTanamanHias?.data?.tahun}
                                    onTolak={handleTolak}
                                />
                            </div>
                            <div className=" text-justify">{dataTanamanHias?.data?.keterangan ?? "-"}</div>
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
                                    {/* Anggrek Potong */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">1.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Anggrek Potong</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[1]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[1]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[1]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[1]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[1]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>
                                    {/* Gerbera (Herbras) */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">2.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Gerbera (Herbras)</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[2]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[2]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[2]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[2]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[2]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Krisan */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">3.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Krisan</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[3]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[3]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[3]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[3]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[3]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Mawar */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">4.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mawar</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[4]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[4]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[4]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[4]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[4]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Sedap Malam */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">5.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sedap Malam</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[5]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[5]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[5]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[5]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[5]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Aglaonema */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">6.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Aglaonema</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[6]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[6]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[6]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[6]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[6]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Anggrek Pot** */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">7.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Anggrek Pot**</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[7]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[7]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[7]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[7]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[7]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Anthurium Bunga */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">8.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Anthurium Bunga</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[8]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[8]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[8]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[8]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[8]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Bromelia */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">9.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bromelia</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[9]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[9]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[9]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[9]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[9]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Bugenvil */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">10.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bugenvil</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[10]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[10]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[10]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[10]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[10]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Cordyline */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">11.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Cordyline</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[11]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[11]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[11]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[11]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[11]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Dracaena */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">12.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Dracaena</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[12]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[12]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[12]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[12]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Heliconia (Pisang-pisangan) */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">13.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Heliconia (Pisang-pisangan)</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[13]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[13]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[13]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[13]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[12]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[13]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[13]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[13]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[13]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[13]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Ixora (Soka) */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">14.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Ixora (Soka)</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[14]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[14]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[14]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[14]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[14]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Pakis */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">15.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Pakis</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[15]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[15]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[15]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[15]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[15]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Palem */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">16.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Palem</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[16]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[16]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[16]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[16]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[16]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Phylodendron */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">17.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Phylodendron</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[17]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[17]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[17]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[17]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[17]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Puring */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">18.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Puring</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[18]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[18]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[18]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[18]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[18]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Sansevierie (Lidah mertua) */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">19.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sansevierie</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[19]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[19]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[19]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[19]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[19]?.keterangan ?? "-"}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                    </>

                                    {/* Melati */}
                                    <>
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">20.</div>
                                            <div className="konten text-black/80 text-end"></div>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem className='' value="item-1">
                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Melati</AccordionTrigger>
                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.bulanLalu ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[20]?.luasPanenHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[20]?.luasPanenBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.luasRusak ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.luasPenanamanBaru ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.akhir ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[20]?.produksiHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Belum Habis</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {dataTanamanHias?.data[20]?.produksiBelumHabis ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Satuan Produksi</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.satuanProduksi ?? "-"}
                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.rerataHarga ?? "-"}

                                                        </div>
                                                    </div>
                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">Keterangan</div>
                                                        <div className="konten text-black/80 text-end">
                                                            {dataTanamanHias?.data[20]?.keterangan ?? "-"}
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
            </div>
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
            </div>
            {/* table */}
        </div>
    )
}

export default ValidasiTanamanHias