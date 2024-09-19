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
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';

const KorlubSayuranBuah = () => {
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
    const monthNumber = dataSayuran?.data?.bulan; // Ambil bulan dari data API
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
        mutate(`/validasi/korluh-sayur-buah/kec?kecamatan=${selectedKecamatan}&bulan=${tahun}/${bulan}`);
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
    const validationText = getValidationText(dataSayuran?.data?.validasi);
    // validasi

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">BPP Kecamatan Sayuran Buah</div>
            {/* title */}

            {/* top */}
            <div className="header flex gap-2 justify-end items-center mt-4">
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
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
                    </Button>
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
                    <Link href="/bpp-kecamatan/sayuran-buah/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang Merah */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A2.</TableCell>
                        <TableCell className="border border-slate-200">Bawang Merah</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang daun */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang daun */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang daun */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang daun */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang daun */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                    {/* Bawang daun */}
                    <TableRow>
                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                        <TableCell className="border border-slate-200">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">belum ada</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                        <TableCell className="border border-slate-200 text-center">233</TableCell>
                    </TableRow>
                    {/*  */}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            {/* <div className="pagi flex items-center lg:justify-end justify-center">
                {dataSayuran?.data?.pagination?.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataSayuran?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div> */}
            {/* pagination */}
        </div>
    )
}

export default KorlubSayuranBuah