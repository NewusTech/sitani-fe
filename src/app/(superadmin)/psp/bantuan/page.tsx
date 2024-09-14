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
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import Swal from 'sweetalert2';
import FilterTable from '@/components/FilterTable';

const Bantuan = () => {
    // TES
    interface Kecamatan {
        nama?: string;
    }
    interface Desa {
        nama?: string;
    }

    interface Pagination {
        page: number,
        perPage: number,
        totalPages: number,
        totalCount: number,
    }
    interface Data {
        id?: string;
        kecamatan?: Kecamatan;
        desa?: Desa;
        jenisBantuan?: string;
        periode?: string;
        keterangan?: string;
    }

    interface ResponseData {
        data: Data[]
        pagination: Pagination;
    }

    interface Response {
        status: string,
        data: ResponseData,
        message: string
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
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    const { data: dataPSP }: SWRResponse<Response> = useSWR(
        `/psp/bantuan/get?page=${currentPage}&search=${search}&limit=10&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    console.log(dataPSP)

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/psp/bantuan/delete/${id}`, {
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
        } mutate(`/psp/bantuan/get?page=${currentPage}&search=${search}&limit=10&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`);
    };

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Kecamatan", key: "kecamatan" },
        { label: "Desa", key: "desa" },
        { label: "Jenis Bantuan", key: "jenisBantuan" },
        { label: "Periode", key: "periode" },
        { label: "Keterangan", key: "keterangan" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "desa", "aksi"];
            } else {
                return ["no", "kecamatan", "desa", "jenisBantuan", "periode", "keterangan", "aksi"];
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
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Bantuan</div>
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
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                            label="Kecamatan"
                            placeholder="Pilih Kecamatan"
                            value={selectedKecamatan}
                            onChange={(value) => {
                                setSelectedKecamatan(value); // Update state with selected value
                            }}
                        />
                    </div>
                    <Link href="/psp/bantuan/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
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
                            <TableHead className="text-primary py-1">No</TableHead>
                        )}
                        {visibleColumns.includes('kecamatan') && (
                            <TableHead className="text-primary py-1">Kecamatan</TableHead>
                        )}
                        {visibleColumns.includes('desa') && (
                            <TableHead className="text-primary py-1">Desa</TableHead>
                        )}
                        {visibleColumns.includes('jenisBantuan') && (
                            <TableHead className="text-primary py-1">Jenis Bantuan</TableHead>
                        )}
                        {visibleColumns.includes('periode') && (
                            <TableHead className="text-primary py-1">Periode</TableHead>
                        )}
                        {visibleColumns.includes('keterangan') && (
                            <TableHead className="text-primary py-1">Keterangan</TableHead>
                        )}
                        {visibleColumns.includes('akksi') && (
                            <TableHead className="text-primary py-1">Aksi</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataPSP?.data?.data && dataPSP.data.data.length > 0 ? (
                        dataPSP?.data?.data.map((item, index) => (
                            <TableRow key={item.id}>
                                {visibleColumns.includes('no') && (
                                    <TableCell>
                                        {(currentPage - 1) * limit + (index + 1)}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('kecamatan') && (
                                    <TableCell>
                                        {item?.kecamatan?.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('desa') && (
                                    <TableCell>
                                        {item?.desa?.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('jenisBantuan') && (
                                    <TableCell>
                                        {item.jenisBantuan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('periode') && (
                                    <TableCell>
                                        {item.periode ? new Date(item.periode).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }) : 'Tanggal tidak tersedia'}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('keterangan') && (
                                    <TableCell>
                                        {item.keterangan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/psp/bantuan/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link className='' href={`/psp/bantuan/edit/${item.id}`}>
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup onDelete={() => handleDelete(item.id || '')} />
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
                {dataPSP?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataPSP?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default Bantuan