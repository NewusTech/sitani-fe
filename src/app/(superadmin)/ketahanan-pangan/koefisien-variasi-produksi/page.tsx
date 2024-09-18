"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'

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
import DeletePopup from '@/components/superadmin/PopupDelete'
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Paginate from '@/components/ui/paginate'
import Swal from 'sweetalert2'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import FilterTable from '@/components/FilterTable'
import KoefisienVariasiProduksiPrint from '@/components/Print/KetahananPangan/Koefisien-Variasi-Produksi/Index'


const KoefisienVariasiProduksi = () => {
    // Fungsi untuk mengubah format bulan menjadi nama bulan
    const getMonthName = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date); // 'id-ID' untuk bahasa Indonesia
    };

    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    // INTEGRASI
    // GET LIST
    interface Response {
        status: number;
        message: string;
        data: ProduksiData[];
    }

    interface ProduksiData {
        id: number;
        bulan: string; // ISO date string
        panen: number;
        gkpTkPetani: number;
        gkpTkPenggilingan: number;
        jpk: number;
        cabaiMerahKeriting: number;
        berasMedium: number;
        berasPremium: number;
        stokGkg: number;
        stokBeras: number;
        createdAt: string; // ISO date string
        updatedAt: string; // ISO date string
    }

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
    // Tahun
    const [tahun, setTahun] = React.useState("2024");
    // tahun

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataProduksi }: SWRResponse<Response> = useSWR(
        `/kepang/cv-produksi/get?year=${tahun}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET LIST
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/kepang/cv-produksi/delete//${id}`, {
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
            mutate('/kepang/pedagang-eceran/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        }
    };
    // INTEGRASI

    // Filter table
    const columns = [
        // { label: "No", key: "no" },
        // { label: "Bulan", key: "bulan" },
        { label: "Panen", key: "panen" },
        { label: "GKP Petani", key: "gkpPetani" },
        { label: "GKP Penggilingan", key: "gkpPenggilingan" },
        { label: "GKG Penggilingan", key: "gkgPenggilingan" },
        { label: "JPK", key: "jpk" },
        { label: "Cabai Merah Keriting", key: "cabaiMerahKeriting" },
        { label: "Beras Medium", key: "berasMedium" },
        { label: "Beras Premium", key: "berasPremium" },
        { label: "Stok GKG", key: "stokGKG" },
        { label: "Stok Beras", key: "stokBeras" },
        { label: "Aksi", key: "aksi" },
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["panen", "aksi"];
            } else {
                return ["panen", "gkpPetani", "gkpPenggilingan", "gkgPenggilingan", "jpk", "cabaiMerahKeriting", "berasMedium", "berasPremium", "stokGKG", "stokBeras", "aksi"];
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
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Coefesien Variansi (CV) Tk. Produksi</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                {/* print */}
                <KoefisienVariasiProduksiPrint
                    urlApi={`/kepang/cv-produksi/get?year=${tahun}`}
                    tahun={tahun}
                />
                {/* print */}
            </div>
            {/* top */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-4">
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
                    <div className="w-[40px] h-[40px]">
                        <FilterTable
                            columns={columns}
                            defaultCheckedKeys={getDefaultCheckedKeys()}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="w-full mt-4 lg:mt-0">
                    <div className="flex justify-end">
                        <Link href="/ketahanan-pangan/koefisien-variasi-produksi/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Tambah Data
                        </Link>
                    </div>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        {/* {visibleColumns.includes('no') && ( */}
                        <TableHead className="text-primary py-3">No</TableHead>
                        {/* )} */}
                        {/* {visibleColumns.includes('bulan') && ( */}
                        <TableHead className="text-primary py-3">Bulan</TableHead>
                        {/* )} */}
                        {visibleColumns.includes('panen') && (
                            <TableHead className="text-primary py-3">% Panen</TableHead>
                        )}
                        {visibleColumns.includes('gkpPetani') && (
                            <TableHead className="text-primary py-3">GKP Tk. Petani</TableHead>
                        )}
                        {visibleColumns.includes('gkpPenggilingan') && (
                            <TableHead className="text-primary py-3">GKP Tk. Penggilingan</TableHead>
                        )}
                        {visibleColumns.includes('gkgPenggilingan') && (
                            <TableHead className="text-primary py-3">GKG Tk. Penggilingan</TableHead>
                        )}
                        {visibleColumns.includes('jpk') && (
                            <TableHead className="text-primary py-3">JPK</TableHead>
                        )}
                        {visibleColumns.includes('cabaiMerahKeriting') && (
                            <TableHead className="text-primary py-3">Cabai Merah Keriting</TableHead>
                        )}
                        {visibleColumns.includes('berasMedium') && (
                            <TableHead className="text-primary py-3">Beras Medium</TableHead>
                        )}
                        {visibleColumns.includes('berasPremium') && (
                            <TableHead className="text-primary py-3">Beras Premium</TableHead>
                        )}
                        {visibleColumns.includes('stokGKG') && (
                            <TableHead className="text-primary py-3">Stok GKG</TableHead>
                        )}
                        {visibleColumns.includes('stokBeras') && (
                            <TableHead className="text-primary py-3">Stok Beras</TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead className="text-primary py-3">Aksi</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataProduksi?.data && dataProduksi?.data?.length > 0 ? (
                        dataProduksi?.data?.map((item, index) => (
                            <TableRow key={index}>
                                {/* {visibleColumns.includes('no') && ( */}
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                {/* )} */}
                                {/* {visibleColumns.includes('bulan') && ( */}
                                <TableCell>
                                    {getMonthName(item.bulan)}
                                </TableCell>
                                {/* )} */}
                                {visibleColumns.includes('panen') && (
                                    <TableCell>
                                        {item.panen}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('gkpPetani') && (
                                    <TableCell>
                                        {item.gkpTkPetani}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('gkpPenggilingan') && (
                                    <TableCell>
                                        {item.gkpTkPenggilingan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('gkgPenggilingan') && (
                                    <TableCell>
                                        belum ada
                                    </TableCell>
                                )}
                                {visibleColumns.includes('jpk') && (
                                    <TableCell>
                                        {item.jpk}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('cabaiMerahKeriting') && (
                                    <TableCell>
                                        {item.cabaiMerahKeriting}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('berasMedium') && (
                                    <TableCell>
                                        {item.berasMedium}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('berasPremium') && (
                                    <TableCell>
                                        {item.berasPremium}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('stokGKG') && (
                                    <TableCell>
                                        {item.stokGkg}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('stokBeras') && (
                                    <TableCell>
                                        {item.stokBeras}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link href={`/ketahanan-pangan/koefisien-variasi-produksi/detail/${item?.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link href={`/ketahanan-pangan/koefisien-variasi-produksi/edit/${item?.id}`}>
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
                </TableBody>
                <TableFooter className='bg-primary-600'>
                    <TableRow>
                        {/* {visibleColumns.includes('no') && ( */}
                        <TableCell className='text-primary py-3' colSpan={2}>Rata-rata</TableCell>
                        {/* )} */}
                        {visibleColumns.includes('panen') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPetani') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkgPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('jpk') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('cabaiMerahKeriting') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasMedium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasPremium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokGKG') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokBeras') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableCell className="text-primary py-3"></TableCell>
                        )}
                    </TableRow>
                    <TableRow>
                        {/* {visibleColumns.includes('no') && ( */}
                        <TableCell className='text-primary py-3' colSpan={2}>Maksimum</TableCell>
                        {/* )} */}
                        {visibleColumns.includes('panen') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPetani') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkgPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('jpk') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('cabaiMerahKeriting') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasMedium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasPremium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokGKG') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokBeras') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableCell className="text-primary py-3"></TableCell>
                        )}
                    </TableRow>
                    <TableRow>
                        {/* {visibleColumns.includes('no') && ( */}
                        <TableCell className='text-primary py-3' colSpan={2}>Minimum</TableCell>
                        {/* )} */}
                        {visibleColumns.includes('panen') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPetani') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkgPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('jpk') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('cabaiMerahKeriting') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasMedium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasPremium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokGKG') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokBeras') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableCell className="text-primary py-3"></TableCell>
                        )}
                    </TableRow>
                    <TableRow>
                        {/* {visibleColumns.includes('no') && ( */}
                        <TableCell className='text-primary py-3' colSpan={2}>Target CV</TableCell>
                        {/* )} */}
                        {visibleColumns.includes('panen') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPetani') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkgPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('jpk') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('cabaiMerahKeriting') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasMedium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasPremium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokGKG') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokBeras') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableCell className="text-primary py-3"></TableCell>
                        )}
                    </TableRow>
                    <TableRow>
                        {/* {visibleColumns.includes('no') && ( */}
                        <TableCell className='text-primary py-3' colSpan={2}>CV (%)</TableCell>
                        {/* )} */}
                        {visibleColumns.includes('panen') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPetani') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkpPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('gkgPenggilingan') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('jpk') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('cabaiMerahKeriting') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasMedium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('berasPremium') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokGKG') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('stokBeras') && (
                            <TableCell className="text-primary py-3">5370</TableCell>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableCell className="text-primary py-3"></TableCell>
                        )}
                    </TableRow>
                </TableFooter>
            </Table>
            {/* table */}
        </div>
    )
}

export default KoefisienVariasiProduksi