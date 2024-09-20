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
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { SWRResponse, mutate } from "swr";
import Swal from 'sweetalert2';
import KecamatanSelect from '../../SelectComponent/SelectKecamatan'
import FilterTable from '@/components/FilterTable'
import TPHPadi from '@/components/Print/Holtilultura/Padi'


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
            await axiosPrivate.delete(`/tph/realisasi-padi/delete/${id}`, {
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
        mutate(`tph/realisasi-padi/get?bulan=${tahun}/${bulan}&kecamatan=${selectedKecamatan}`);
    };
    // DELETE

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Kecamatan", key: "kecamatan" },
        { label: "Lahan Sawah", key: "lahanSawah" },
        { label: "Lahan Kering", key: "lahanKering" },
        { label: "Total", key: "total" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "aksi"];
            } else {
                return ["no", "kecamatan", "lahanSawah", "lahanKering", "total", "aksi"];
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
            <div className="header flex gap-2 justify-end items-center mt-4">
                <TPHPadi
                    urlApi={`/tph/realisasi-padi/get?bulan=${tahun}/${bulan}&kecamatan=${selectedKecamatan}`}
                    kecamatan={selectedKecamatan}
                    tahun={tahun}
                    bulan={bulan}
                />
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
                                setSelectedKecamatan(value); // Update state with selected value
                            }}
                        />
                    </div>
                    <Link href="/tanaman-pangan-holtikutura/realisasi/padi/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* table */}
            <Table className='border border-slate-200 mt-4 mb-20 lg:mb-0 text-xs shadow-lg rounded-lg'>
                <TableHeader className='bg-primary-600 shadow-lg'>
                    <TableRow>
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
                        {visibleColumns.includes('lahanSawah') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Lahan Sawah
                            </TableHead>
                        )}
                        {visibleColumns.includes('lahanKering') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Lahan Kering
                            </TableHead>
                        )}
                        {visibleColumns.includes('total') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Total
                            </TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Aksi
                            </TableHead>
                        )}
                    </TableRow>
                    <TableRow>
                        {visibleColumns.includes('lahanSawah') && (
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
                        {visibleColumns.includes('lahanKering') && (
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
                        {visibleColumns.includes('total') && (
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
                    {responseData?.data && responseData?.data?.detail?.list?.length > 0 ? (
                        responseData?.data?.detail?.list.map((item, index) => (
                            <TableRow key={index}>
                                {visibleColumns.includes('no') && (
                                    <TableCell className='border border-slate-200 text-center'>
                                        {index + 1}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('kecamatan') && (
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item.kecamatan.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('lahanSawah') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.panenLahanSawah}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.produktivitasLahanSawah}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.produksiLahanSawah}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('lahanKering') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.panenLahanKering}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.produktivitasLahanKering}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.produksiLahanKering}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('total') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.panenTotal}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.produktivitasTotal}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item.produksiTotal}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link href={`/tanaman-pangan-holtikutura/realisasi/padi/detail/${item?.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link href={`/tanaman-pangan-holtikutura/realisasi/padi/edit/${item?.id}`}>
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup onDelete={() => handleDelete(String(item?.id))} />
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
                        {visibleColumns.includes('lahanSawah') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.panenLahanSawah}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.produktivitasLahanSawah}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.produksiLahanSawah}
                                </TableCell>
                            </>
                        )}
                        {visibleColumns.includes('lahanKering') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.panenLahanKering}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.produktivitasLahanKering}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.produksiLahanKering}
                                </TableCell>
                            </>
                        )}
                        {visibleColumns.includes('total') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.panenTotal}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.produktivitasTotal}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.produksiTotal}
                                </TableCell>
                            </>
                        )}
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