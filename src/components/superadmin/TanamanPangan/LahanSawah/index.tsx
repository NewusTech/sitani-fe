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
import TPHLahanSawah from '@/components/Print/Holtilultura/LahanSawah'

// Define the types
interface Kecamatan {
    id: number;
    nama: string;
}

interface LahanSawahDetail {
    id: number;
    tphLahanSawahId: number;
    kecamatanId: number;
    irigasiTeknis: number;
    irigasiSetengahTeknis: number;
    irigasiSederhana: number;
    irigasiDesa: number;
    tadahHujan: number;
    pasangSurut: number;
    lebak: number;
    lainnya: number;
    jumlah: number;
    keterangan: string;
    kecamatan: Kecamatan;
}

interface LahanSawahData {
    detail: {
        tahun: number;
        list: LahanSawahDetail[];
    };
    jumlahIrigasiSetengahTeknis: number;
    jumlahIrigasiSederhana: number;
    jumlahIrigasiTeknis: number;
    jumlahIrigasiDesa: number;
    jumlahPasangSurut: number;
    jumlahTadahHujan: number;
    jumlahLainnya: number;
    jumlahLebak: number;
    jumlah: number;
}

interface Response {
    status: number;
    message: string;
    data: LahanSawahData;
}


const LahanSawah = () => {
    // INTERGASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const currentYear = new Date().getFullYear();

    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
    const [tahun, setTahun] = React.useState(`${currentYear}`);
    const [activeTab, setActiveTab] = useState("lahanSawah");

    // GETALL
    const { data: responseData, error } = useSWR<Response>(
        `tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`,
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

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/tph/lahan-sawah/delete/${id}`, {
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
        mutate(`tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`);
    };
    // DELETE

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Kecamatan", key: "kecamatan" },
        { label: "Luas Lahan Sawah", key: "luasLahanSawah" },
        { label: "Keterangan", key: "keterangan" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "aksi"];
            } else {
                return ["no", "kecamatan", "luasLahanSawah", "keterangan", "aksi"];
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
                <TPHLahanSawah
                    urlApi={`tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`}
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
                                setSelectedKecamatan(value); // Update state with selected value
                            }}
                        />
                    </div>
                    <Link href="/tanaman-pangan-holtikutura/lahan/lahan-sawah/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
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
                        {visibleColumns.includes('luasLahanSawah') && (
                            <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                Luas Lahan Sawah (Ha)
                            </TableHead>
                        )}
                        {visibleColumns.includes('keterangan') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Ket
                            </TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Aksi
                            </TableHead>
                        )}
                    </TableRow>
                    <TableRow>
                        {visibleColumns.includes('luasLahanSawah') && (
                            <>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigasi Teknis
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigas 1/2 Teknis
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigasi Sederhana
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigasi Desa
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Tadah Hujan
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Pasang Surut
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Lebak
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Lainnya
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Jumlah
                                </TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {responseData?.data && responseData?.data?.detail?.list?.length > 0 ? (
                        responseData?.data?.detail?.list.map((item, index) => (
                            <TableRow key={item.id}>
                                {visibleColumns.includes('no') && (
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                )}
                                {visibleColumns.includes('kecamatan') && (
                                    <TableCell>{item.kecamatan.nama}</TableCell>
                                )}
                                {visibleColumns.includes('luasLahanSawah') && (
                                    <>
                                        <TableCell className="text-center">{item.irigasiTeknis}</TableCell>
                                        <TableCell className="text-center">{item.irigasiSetengahTeknis}</TableCell>
                                        <TableCell className="text-center">{item.irigasiSederhana}</TableCell>
                                        <TableCell className="text-center">{item.irigasiDesa}</TableCell>
                                        <TableCell className="text-center">{item.tadahHujan}</TableCell>
                                        <TableCell className="text-center">{item.pasangSurut}</TableCell>
                                        <TableCell className="text-center">{item.lebak}</TableCell>
                                        <TableCell className="text-center">{item.lainnya}</TableCell>
                                        <TableCell className="text-center">{item.jumlah}</TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('keterangan') && (
                                    <TableCell>{item.keterangan}</TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell className="text-center">
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/tanaman-pangan-holtikutura/lahan/lahan-sawah/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link className='' href={`/tanaman-pangan-holtikutura/lahan/lahan-sawah/edit/${item.id}`}>
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
                            <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                            </TableHead>
                        )}
                        {visibleColumns.includes('kecamatan') && (
                            <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                Jumlah
                            </TableHead>
                        )}
                        {visibleColumns.includes('luasLahanSawah') && (
                            <>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiTeknis}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiSetengahTeknis}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiSederhana}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiDesa}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahTadahHujan}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahPasangSurut}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahLebak}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahLainnya}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlah}
                                </TableHead>
                            </>
                        )}
                        {visibleColumns.includes('keterangan' || 'aksi') && (
                            <TableHead colSpan={2} className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                            </TableHead>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default LahanSawah;
