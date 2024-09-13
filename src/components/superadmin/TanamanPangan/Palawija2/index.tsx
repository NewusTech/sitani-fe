"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
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
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import KecamatanSelect from '../../SelectComponent/SelectKecamatan'
import FilterTable from '@/components/FilterTable'

interface Kecamatan {
    id: number;
    nama: string;
}

interface ListItem {
    id: number;
    tphRealisasiPalawija2Id: number;
    kecamatanId: number;
    kacangHijauPanen: number;
    kacangHijauProduktivitas: number;
    kacangHijauProduksi: number;
    ubiKayuPanen: number;
    ubiKayuProduktivitas: number;
    ubiKayuProduksi: number;
    ubiJalarPanen: number;
    ubiJalarProduktivitas: number;
    ubiJalarProduksi: number;
    kecamatan: Kecamatan;
}

interface Data {
    detail: {
        bulan: string;
        list: ListItem[];
    };
    kacangHijauPanen: number;
    kacangHijauProduktivitas: number;
    kacangHijauProduksi: number;
    ubiKayuPanen: number;
    ubiKayuProduktivitas: number;
    ubiKayuProduksi: number;
    ubiJalarPanen: number;
    ubiJalarProduktivitas: number;
    ubiJalarProduksi: number;
}

interface Response {
    status: number;
    message: string;
    data: Data;
}

const Palawija2 = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    // filter date
    const formatDate = (date?: Date): string => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}/${month}/${day}`;
    };
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination

    // limit
    const [limit, setLimit] = useState(10);
    // limit
    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    // filter tahun bulan
    const [tahun, setTahun] = React.useState("2024");
    const [bulan, setBulan] = React.useState("1");
    // filter tahun bulan

    // GETALL
    const { data: dataPalawija2 }: SWRResponse<Response> = useSWR(
        `/tph/realisasi-palawija-2/get?bulan=${tahun}/${bulan}&kecamatan=${selectedKecamatan}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log("ini datanya =", dataPalawija2)

    // handle delete
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/tph/realisasi-palawija-2/delete/${id}`, {
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
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400',
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
        } catch (error: any) {
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
        } mutate(`/tph/realisasi-palawija-2/get?bulan=${tahun}/${bulan}&kecamatan=${selectedKecamatan}`);
    };

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Kecamatan", key: "kecamatan" },
        { label: "Kacang Hijau", key: "kacangHijau" },
        { label: "Ubi Kayu", key: "ubiKayu" },
        { label: "Ubi Jalar", key: "ubiJalar" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "aksi"];
            } else {
                return ["no", "kecamatan", "kacangHijau", "ubiKayu", "ubiJalar", "aksi"];
            }
        }
        return [];
    };

    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setVisibleColumns(getDefaultCheckedKeys());
        const handleResize = () => {
            setVisibleColumns(getDefaultCheckedKeys());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isClient) {
        return null;
    }

    const handleFilterChange = (key: string, checked: boolean) => {
        setVisibleColumns(prev =>
            checked ? [...prev, key] : prev.filter(col => col !== key)
        );
    };
    // Filter Table

    return (
        <div>
            {/* top */}
            <div className="header flex gap-2 justify-between items-center mt-4">
                <div className="search md:w-[50%]">
                    {/* <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    /> */}
                </div>
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
                        <FilterTable
                            columns={columns}
                            defaultCheckedKeys={getDefaultCheckedKeys()}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <div className="w-fit">
                        <KecamatanSelect
                            value={selectedKecamatan}
                            onChange={(value) => {
                                setSelectedKecamatan(value);
                            }}
                        />
                    </div>
                    {/* <div className="fil-kect w-[150px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tanaman" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                    <Link href="/tanaman-pangan-holtikutura/realisasi/palawija-2/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        {visibleColumns.includes('no') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                No
                            </TableHead>
                        )}
                        {visibleColumns.includes('kecamatan') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Kecamatan
                            </TableHead>
                        )}
                        {visibleColumns.includes('kacangHijau') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Kacang Hijau
                            </TableHead>
                        )}
                        {visibleColumns.includes('ubiKayu') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Ubi Kayu
                            </TableHead>
                        )}
                        {visibleColumns.includes('ubiJalar') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Ubi Jalar
                            </TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Aksi
                            </TableHead>
                        )}
                    </TableRow>
                    <TableRow>
                        {visibleColumns.includes('kacangHijau') && (
                            <>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Panen <br /> (ha)
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Produktivitas <br /> (ku/ha)
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Produksi <br /> (ton)
                                </TableHead>
                            </>
                        )}
                        {visibleColumns.includes('ubiKayu') && (
                            <>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Panen <br /> (ha)
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Produktivitas <br /> (ku/ha)
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Produksi <br /> (ton)
                                </TableHead>
                            </>
                        )}
                        {visibleColumns.includes('ubiJalar') && (
                            <>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Panen <br /> (ha)
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Produktivitas <br /> (ku/ha)
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Produksi <br /> (ton)
                                </TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataPalawija2?.data && dataPalawija2?.data?.detail?.list?.length > 0 ? (
                        dataPalawija2?.data?.detail?.list.map((item, index) => (
                            <TableRow key={item.id}>
                                {visibleColumns.includes('no') && (
                                    <TableCell className='border border-slate-200 text-center'>
                                        {index + 1}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('kecamatan') && (
                                    <TableCell className='border border-slate-200'>
                                        {item.kecamatan.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('kacangHijau') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.kacangHijauPanen}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.kacangHijauProduktivitas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.kacangHijauProduksi}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('ubiKayu') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.ubiKayuPanen}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.ubiKayuProduktivitas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.ubiKayuProduksi}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('ubiJalar') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.ubiJalarPanen}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.ubiJalarProduktivitas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.ubiJalarProduksi}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/tanaman-pangan-holtikutura/realisasi/palawija-2/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link className='' href={`/tanaman-pangan-holtikutura/realisasi/palawija-2/edit/${item.id}`}>
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup onDelete={async () => { }} />
                                        </div>
                                    </TableCell>
                                )}
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
                        {visibleColumns.includes('no') && (
                            <TableCell className='border border-slate-200'>
                            </TableCell>
                        )}
                        {visibleColumns.includes('kecamatan') && (
                            <TableCell className='border font-semibold border-slate-200 text-center'>
                                Jumlah
                            </TableCell>
                        )}
                        {visibleColumns.includes('kacangHijau') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                            </>
                        )}
                        {visibleColumns.includes('ubiKayu') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                            </>
                        )}
                        {visibleColumns.includes('ubiJalar') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    234
                                </TableCell>
                            </>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default Palawija2