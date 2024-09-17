"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
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
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import FilterTable from '@/components/FilterTable';
import PSPPenerimaUPPO from '@/components/Print/PSP/PenerimaUppo';

const DataPenerimaUppo = () => {
    // TES
    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string;
        updatedAt: string;
    }

    interface Data {
        id: number;
        kecamatanId: number;
        desaId: number;
        namaPoktan: string;
        ketuaPoktan: string;
        titikKoordinat: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface Pagination {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        links: {
            prev: string | null;
            next: string | null;
        };
    }

    interface Response {
        status: number;
        message: string;
        data: {
            data: Data[];
            pagination: Pagination;
        };
    }

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
    const [limit, setLimit] = useState(10);
    // limit
    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    const { data: dataUser }: SWRResponse<Response> = useSWR(
        `/psp/penerima-uppo/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => {
                    return res.data;
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    return { status: "error", message: "Failed to fetch data" };
                })
        // .then((res: any) => res.data)
    );

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/psp/penerima-uppo/delete/${id}`, {
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
        mutate(`/psp/penerima-uppo/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`);
    };

    // Filter table
    const columns = [
        { label: "Kecamtan", key: "kecamatan" },
        { label: "Desa", key: "desa" },
        { label: "Nama Poktan", key: "namaPoktan" },
        { label: "Nama Ketua", key: "namaKetua" },
        { label: "Titik Koordinat", key: "titikKoordinat" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["kecamatan", "desa", "namaPoktan", "aksi"];
            } else {
                return ["kecamatan", "desa", "namaPoktan", "namaKetua", "ketuaPoktan", "titikKoordinat", "aksi"];
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
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Data Penerima UPPO</div>
            {/* title */}

            {/* top */}
            <div className="header flex gap-2 justify-between items-center mt-4">
                <div className="search md:w-[50%]">
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Cari"
                        value={search}
                        onChange={handleSearchChange}
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                {/* print */}
                <PSPPenerimaUPPO
                    urlApi={`/psp/penerima-uppo/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
                    kecamatan={selectedKecamatan}
                />
                {/* print */}
            </div>
            {/*  */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                    <div className="w-auto">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {startDate ? format(startDate, "PPP") : <span>Tanggal Awal</span>}
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
                    <div className="">-</div>
                    <div className="w-auto">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {endDate ? format(endDate, "PPP") : <span>Tanggal Akhir</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setendDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
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
                    <Link href="/psp/data-penerima-uppo/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-1">No</TableHead>
                        {visibleColumns.includes('kecamatan') && (
                            <TableHead className="text-primary py-1">Kecamatan</TableHead>
                        )}
                        {visibleColumns.includes('desa') && (
                            <TableHead className="text-primary py-1">Desa</TableHead>
                        )}
                        {visibleColumns.includes('namaPoktan') && (
                            <TableHead className="text-primary py-1 ">Nama Poktan</TableHead>
                        )}
                        {visibleColumns.includes('namaKetua') && (
                            <TableHead className="text-primary py-1 hidden md:table-cell">Nama Ketua</TableHead>
                        )}
                        {visibleColumns.includes('titikKoordinat') && (
                            <TableHead className="text-primary py-1 hidden md:table-cell">Titik Koordinat</TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead className="text-primary py-1">Aksi</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataUser?.data?.data && dataUser.data.data.length > 0 ? (
                        dataUser.data.data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {(currentPage - 1) * limit + (index + 1)}
                                </TableCell>
                                {visibleColumns.includes('kecamatan') && (
                                    <TableCell>
                                        {item.kecamatan.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('desa') && (
                                    <TableCell>
                                        {item.desa.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('namaPoktan') && (
                                    <TableCell>
                                        {item.namaPoktan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('ketuaPoktan') && (
                                    <TableCell className='hidden md:table-cell'>
                                        {item.ketuaPoktan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('titikKoordinat') && (
                                    <TableCell className='hidden md:table-cell'>
                                        {item.titikKoordinat}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/psp/data-penerima-uppo/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link className='' href={`/psp/data-penerima-uppo/edit/${item.id}`}>
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup onDelete={() => handleDelete(String(item.id) || "")} />
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataUser?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataUser?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default DataPenerimaUppo