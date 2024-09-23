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
import KorluhSayuranMobile from '@/components/KorluhMobile/KorluhSayuranMobile';

const KorluhSayuranBuah = () => {
    // INTEGRASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    // filter date
    const formatDate = (date?: Date): string => {
        if (!date) return ''; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()
    // Memoize the formatted date to avoid unnecessary recalculations on each render
    const filterStartDate = React.useMemo(() => formatDate(startDate), [startDate]);
    const filterEndDate = React.useMemo(() => formatDate(endDate), [endDate]);
    // filter date   
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination
    // serach
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    // serach
    // limit
    const [limit, setLimit] = useState(1);
    // limit
    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    // GETALL
    const { data: dataSayuran }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `korluh/sayur-buah/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log(dataSayuran)

    // INTEGRASI

    // DELETE
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: string) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.delete(`/korluh/sayur-buah/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id)
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
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`korluh/sayur-buah/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`);
    };
    // DELETE

    // VERIFIKASI/ TOLAK
    const handleVerifikasi = async (id: string) => {
        try {
            // await axiosPrivate.delete(`/korluh/padi/delete/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`,
            //     },
            // });
            console.log(id)
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil diverifikasi!',
                text: 'Data sudah disimpan sistem!',
                timer: 2500,
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
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memverifikasi data!';
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
        }
    };

    const handleTolak = async (id: string, alasan: string) => {
        try {
            // await axiosPrivate.post(`/korluh/padi/tolak/${id}`,
            //     {
            //         alasan: alasan  // Mengirimkan alasan dalam body request
            //     },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`,
            //         },
            //     });
            console.log(`Data dengan ID ${id} ditolak dengan alasan: ${alasan}`);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditolak!',
                text: 'Data sudah disimpan sistem!',
                timer: 2500,
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
        }
    };

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Korluh Sayuran Buah</div>
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
                            {/* <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
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
                            </Button> */}
                        </div>
                    </div>
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <Link href="/korluh/sayuran-buah/tambah" className='bg-primary px-3 md:px-8 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-base mb-3'>
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
                {dataSayuran?.data?.data.map((item: any, index: any) => (
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
                    {dataSayuran?.data?.data.map((item: any, index: any) => (
                        <div key={index}>
                            {item?.kecamatan.nama || "Tidak ada data"}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="font-semibold">
                        Desa:
                    </div>
                    {dataSayuran?.data?.data.map((item: any, index: any) => (
                        <div key={index}>
                            {item?.desa.nama || "Tidak ada data"}
                        </div>
                    ))}
                </div>
            </div>
            {/* kecamatan */}

            {/*table mobile */}
            <div className="mobile  block md:hidden sm:hidden lg:hidden">
                <div className="garis my-2 mb-3 h-[1px] w-full bg-slate-400"></div>
                {/* <KorluhSayuranMobile urlApi={`korluh/sayur-buah/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`} /> */}
            </div>
            {/*table mobile */}

            {/* table */}
            <div className="tabel-wrap">
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
                            <TableHead rowSpan={2} className="text-primary text-center py-1 border border-slate-200">
                                Aksi
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
                        {dataSayuran?.data?.data && dataSayuran?.data?.data?.length > 0 ? (
                            dataSayuran.data.data.map((item: any, index: number) => (
                                <>
                                    {/* Bawang daun */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                                        <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[1]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[1]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[1].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[1].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[1].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Bawang Merah */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">2.</TableCell>
                                        <TableCell className="border border-slate-200">Bawang Merah</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[2]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[2]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[2].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[2].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[2].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Bawang Putih */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">3.</TableCell>
                                        <TableCell className="border border-slate-200">Bawang Putih</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[3]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[3]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[3].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[3].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[3].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Kembang Kol */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">4.</TableCell>
                                        <TableCell className="border border-slate-200">Kembang Kol</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[4]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[4]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[4].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[4].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[4].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Kentang */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">5.</TableCell>
                                        <TableCell className="border border-slate-200">Kentang</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[5]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[5]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[5].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[5].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[5].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Kubis */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">6.</TableCell>
                                        <TableCell className="border border-slate-200">Kubis</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[6]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[6]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[6].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[6].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[6].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Petsai/Sawi */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">7.</TableCell>
                                        <TableCell className="border border-slate-200">Petsai/Sawi</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[7]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[7]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[7].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[7].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[7].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/*  */}
                                    {/* Wortel */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">8.</TableCell>
                                        <TableCell className="border border-slate-200">Wortel</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[8]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[8]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[8].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[8].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[8].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Bayam */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">9.</TableCell>
                                        <TableCell className="border border-slate-200">Bayam</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[9]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[9]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[9].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[9].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[9].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Buncis */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">10.</TableCell>
                                        <TableCell className="border border-slate-200">Buncis</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[10]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[10]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[10].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[10].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[10].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Cabai Besar TW/Teropong */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">11.</TableCell>
                                        <TableCell className="border border-slate-200">Cabai Besar TW/Teropong</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[11]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[11]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[11].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[11].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[11].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Cabai Keriting */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">12.</TableCell>
                                        <TableCell className="border border-slate-200">Cabai Keriting</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[12]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[12]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[12].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[12].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[12].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Cabai Rawit */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">13.</TableCell>
                                        <TableCell className="border border-slate-200">Cabai Rawit</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[13]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[13]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[13].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[13].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[13].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Jamur Tiram */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">14.</TableCell>
                                        <TableCell className="border border-slate-200">Jamur Tiram</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[14]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[14]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[14].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[14].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[14].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Jamur Merang */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">15.</TableCell>
                                        <TableCell className="border border-slate-200">Jamur Merang</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[15]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[15]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[15].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[15].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[15].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Jamur Lainnya */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">16.</TableCell>
                                        <TableCell className="border border-slate-200">Jamur Lainnya</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[16]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[16]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[16].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[16].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[16].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Kacang Panjang */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">17.</TableCell>
                                        <TableCell className="border border-slate-200">Kacang Panjang</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[17]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[17]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[17].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[17].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[17].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Kangkung */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">18.</TableCell>
                                        <TableCell className="border border-slate-200">Kangkung</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[18]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[18]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[18].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[18].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[18].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Mentimun */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">19.</TableCell>
                                        <TableCell className="border border-slate-200">Mentimun</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[19]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[19]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[19].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[19].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[19].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Labu Siam */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">20.</TableCell>
                                        <TableCell className="border border-slate-200">Labu Siam</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[20]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[20]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[20].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[20].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[20].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Paprika */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">21.</TableCell>
                                        <TableCell className="border border-slate-200">Paprika</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[21]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[21]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[21]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[21].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[21].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[21].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Terung */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">22.</TableCell>
                                        <TableCell className="border border-slate-200">Terung</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[22]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[22]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[22]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[22].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[22].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[22].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Tomat */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">23.</TableCell>
                                        <TableCell className="border border-slate-200">Tomat</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[23]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[23]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                     {item[23]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[23].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[23].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[23].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Melon */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">B1.</TableCell>
                                        <TableCell className="border border-slate-200">Melon</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[24]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[24]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[24]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[24].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[24].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[24].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Semangka */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">2.</TableCell>
                                        <TableCell className="border border-slate-200">Semangka</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[25]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[25]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[25]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[25].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[25].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[25].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Stroberi */}
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-center">3.</TableCell>
                                        <TableCell className="border border-slate-200">Stroberi</TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.hasilProduksi ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.luasPanenHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.luasPanenBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.luasRusak ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.luasPenanamanBaru ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.produksiHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.produksiBelumHabis ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[26]?.rerataHarga ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 text-center">
                                            {item[26]?.keterangan ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[26]?.id && (
                                                        <>
                                                            <Link title="Detail" href={`/korluh/sayuran-buah/detail/${item[26].id}`}>
                                                                <EyeIcon />
                                                            </Link>
                                                            <Link title="Edit" href={`/korluh/sayuran-buah/edit/${item[26].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[26].id))} />
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
                                <TableCell colSpan={11} className='text-center'>Tidak Ada Data</TableCell>
                            </TableRow>
                        )}
                        {/*  */}
                    </TableBody>
                </Table>
            </div>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataSayuran?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataSayuran?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default KorluhSayuranBuah