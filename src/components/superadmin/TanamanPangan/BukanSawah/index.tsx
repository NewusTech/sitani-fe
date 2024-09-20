"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
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
import TPHBukanSawah from '@/components/Print/Holtilultura/BukanSawah'

interface Kecamatan {
    id: number;
    nama: string;
}

interface LahanBukanSawahDetail {
    id: number;
    tphLahanBukanSawahId: number;
    kecamatanId: number;
    tegal: number;
    ladang: number;
    perkebunan: number;
    hutanRakyat: number;
    padangPengembalaanRumput: number;
    hutanNegara: number;
    smtTidakDiusahakan: number;
    lainnya: number;
    jumlahLahanBukanSawah: number;
    lahanBukanPertanian: number;
    total: number;
    kecamatan: Kecamatan;
}

interface LahanBukanSawahData {
    detail: {
        tahun: number;
        list: LahanBukanSawahDetail[];
    };
    total: number;
    jumlahLahanBukanSawah: number;
    padangPengembalaanRumput: number;
    smtTidakDiusahakan: number;
    hutanNegara: number;
    hutanRakyat: number;
    lainnya: number;
    perkebunan: number;
    ladang: number;
    tegal: number;
    lahanBukanPertanian: number;
}

interface Response {
    status: number;
    message: string;
    data: LahanBukanSawahData;
}

const BukanSawah = () => {

    // INTERGASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const currentYear = new Date().getFullYear();

    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
    const [tahun, setTahun] = React.useState(`${currentYear}`);

    // GETALL
    const { data: responseData, error } = useSWR<Response>(
        `tph/lahan-bukan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`,
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
    const [activeTab, setActiveTab] = useState("bukanSawah");

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/tph/lahan-bukan-sawah/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            localStorage.setItem('activeTab', activeTab);
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
        mutate(`tph/lahan-bukan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`);
    };
    // DELETE

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Kecamatan", key: "kecamatan" },
        { label: "Lahan Bukan Sawah", key: "lahanBukanSawah" },
        { label: "Lahan Bukan Pertanian", key: "lahanBukanPertanian" },
        { label: "Total", key: "total" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "aksi"];
            } else {
                return ["no", "kecamatan", "lahanBukanSawah", "lahanBukanPertanian", "total", "aksi"];
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
                {/* print */}
                <TPHBukanSawah
                    urlApi={`tph/lahan-bukan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`}
                    kecamatan={selectedKecamatan}
                    tahun={tahun}
                />
                {/* print */}
            </div>
            {/*  */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                    <div className="w-auto">
                        <Select
                            onValueChange={(value) => setTahun(value)}
                            value={tahun}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tahun" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2020">2020</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                                <SelectItem value="2027">2027</SelectItem>
                                <SelectItem value="2028">2028</SelectItem>
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
                    <div className="w-full">
                        <KecamatanSelect
                            value={selectedKecamatan}
                            onChange={(value) => {
                                setSelectedKecamatan(value);
                            }}
                        />
                    </div>
                    <Link href="/tanaman-pangan-holtikutura/lahan/bukan-sawah/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* table */}
            <Table className='border border-slate-200 mt-4 mb-20 lg:mb-0 text-xs shadow-lg rounded-lg'>
                <TableHeader className='bg-primary-600 shadow-lg'>
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
                        {visibleColumns.includes('lahanBukanSawah') && (
                            <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                Lahan Bukan Sawah
                            </TableHead>
                        )}
                        {visibleColumns.includes('lahanBukanPertanian') && (
                            <TableHead colSpan={1} className="text-primary py-1 border border-slate-200 text-center">
                                Lahan Bukan Pertanian
                            </TableHead>
                        )}
                        {visibleColumns.includes('total') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
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
                        {visibleColumns.includes('lahanBukanSawah') && (
                            <>                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                Tegal/Kebun
                            </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Ladang/Huma
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Perkebunan
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Hutan Rakyat
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Padang Penggembalaan Rumput
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Hutan Negara
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Smt. Tidak Diusahakan
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Lainnya Tambak, Kolam Empang
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Jumlah Lahan Bukan Sawah
                                </TableHead>
                            </>
                        )}
                        {visibleColumns.includes('lahanBukanPertanian') && (
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                Jalan, Pemukiman, Perkantoran, Sungai
                            </TableHead>
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
                                    <TableCell className='border border-slate-200 '>
                                        {item?.kecamatan.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('lahanBukanSawah') && (
                                    <>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.tegal}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.ladang}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.perkebunan}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.hutanRakyat}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.padangPengembalaanRumput}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.hutanNegara}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.smtTidakDiusahakan}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.lainnya}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.jumlahLahanBukanSawah}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('lahanBukanPertanian') && (
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item?.lahanBukanPertanian}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('total') && (
                                    <TableCell className='border border-slate-200 text-center'>
                                        {item?.total}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/tanaman-pangan-holtikutura/lahan/bukan-sawah/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link className='' href={`/tanaman-pangan-holtikutura/lahan/bukan-sawah/edit/${item.id}`}>
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup onDelete={() => handleDelete(item.id ? item.id.toString() : '')} />
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
                        {visibleColumns.includes('lahanBukanSawah') && (
                            <>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.tegal}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.ladang}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.perkebunan}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.hutanRakyat}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.padangPengembalaanRumput}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.hutanNegara}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.smtTidakDiusahakan}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.lainnya}
                                </TableCell>
                                <TableCell className='border font-semibold border-slate-200 text-center'>
                                    {responseData?.data?.jumlahLahanBukanSawah}
                                </TableCell>
                            </>
                        )}
                        {visibleColumns.includes('lahanBukanPertenian') && (
                            <TableCell className='border font-semibold border-slate-200 text-center'>
                                {responseData?.data?.lahanBukanPertanian}
                            </TableCell>
                        )}
                        {visibleColumns.includes('total' || 'aksi') && (
                            <TableCell className='border font-semibold border-slate-200 text-center'>
                                {responseData?.data?.total}
                            </TableCell>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default BukanSawah