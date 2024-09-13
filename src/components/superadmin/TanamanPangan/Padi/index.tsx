"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import Link from 'next/link'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '../../PopupDelete'
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { SWRResponse, mutate } from "swr";
import Swal from 'sweetalert2';
import KecamatanSelect from '../../SelectComponent/SelectKecamatan'


interface Kecamatan {
    id: number;
    nama: string;
}

interface DetailItem {
    id: number;
    tphRealisasiPadiId: number;
    kecamatanId: number;
    panenLahanSawah: number;
    produktivitasLahanSawah: number;
    produksiLahanSawah: number;
    panenLahanKering: number;
    produktivitasLahanKering: number;
    produksiLahanKering: number;
    panenTotal: number;
    produktivitasTotal: number;
    produksiTotal: number;
    kecamatan: Kecamatan;
}

interface Detail {
    bulan: string;
    list: DetailItem[];
}

interface Data {
    detail: Detail;
    produktivitasLahanKering: number;
    produktivitasLahanSawah: number;
    produksiLahanKering: number;
    produksiLahanSawah: number;
    panenLahanKering: number;
    panenLahanSawah: number;
    produktivitasTotal: number;
    produksiTotal: number;
    panenTotal: number;
}

interface Response {
    status: number;
    message: string;
    data: Data;
}


const Padi = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()
    // INTERGASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
    const [tahun, setTahun] = React.useState("2024");
    const [bulan, setBulan] = React.useState("1");


    // GETALL
    const { data: responseData, error } = useSWR<Response>(
        `tph/realisasi-padi/get?bulan=${tahun}/${bulan}&kecamatan=${selectedKecamatan}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    if (error) {
        Swal.fire('Error', 'Failed to fetch data', 'error');
    }
    // const data = responseData?.data?.list || [];

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/tph/lahan-sawah/delete/${id}`, {
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
        }
        mutate(`tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`);
    };
    // DELETE

    return (
        <div>
            {/* top */}
            <div className="header flex gap-2 justify-end items-center mt-4">
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
                    <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <div className="w-fit">
                        <KecamatanSelect
                            value={selectedKecamatan}
                            onChange={(value) => {
                                setSelectedKecamatan(value); // Update state with selected value
                            }}
                        />
                    </div>
                    <Link href="/tanaman-pangan-holtikutura/realisasi/padi/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px]'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Kecamatan
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Lahan Sawah
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Lahan Kering
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Total
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {responseData?.data && responseData?.data?.detail?.list?.length > 0 ? (
                        responseData?.data?.detail?.list.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className='border border-slate-200 text-center'>
                                    {index + 1}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.kecamatan.nama}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.panenLahanSawah}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.produktivitasLahanSawah}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.produksiLahanSawah}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.panenLahanKering}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.produktivitasLahanKering}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.produksiLahanKering}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.panenTotal}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.produktivitasTotal}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {item.produksiTotal}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Link href={`/tanaman-pangan-holtikultura/realisasi/detail/${item?.id}`}>
                                            <EyeIcon />
                                        </Link>
                                        <Link href={`/tanaman-pangan-holtikultura/realisasi/edit/${item?.id}`}>
                                            <EditIcon />
                                        </Link>
                                        <DeletePopup onDelete={() => handleDelete(String(item?.id))} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={13} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell className='border border-slate-200'>
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            Jumlah
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.panenLahanSawah}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.produktivitasLahanSawah}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.produksiLahanSawah}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.panenLahanKering}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.produktivitasLahanKering}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.produksiLahanKering}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.panenTotal}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.produktivitasTotal}
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            {responseData?.data?.produksiTotal}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
            {/* pagination */}

            {/* pagination */}
        </div>
    )
}

export default Padi