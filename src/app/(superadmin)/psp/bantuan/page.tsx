"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'

// Filter di mobile
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import Label from '@/components/ui/label'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Filter,
} from "lucide-react"
// Filter di mobile

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
import PSPBantuan from '@/components/Print/PSP/Bantuan';
import TambahIcon from '../../../../../public/icons/TambahIcon';

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

    // otomatis hitung tahun
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    // const [tahun, setTahun] = React.useState("2024");
    const [tahun, setTahun] = React.useState(() => new Date().getFullYear().toString());
    // otomatis hitung tahun

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
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
        // const handleResize = () => {
        //     setVisibleColumns(getDefaultCheckedKeys());
        // };
        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);
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

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
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
                        <PSPBantuan
                            urlApi={`/psp/bantuan/get?page=${currentPage}&search=${search}&limit=10&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
                            startDate={filterStartDate}
                            endDate={filterEndDate}
                            kecamatan={selectedKecamatan}
                        />
                        {/* print */}
                    </div>
                    {/*  */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                            {/* filter tanggal */}
                            {/* filter tanggal */}
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
                </>
            </div>
            {/* Dekstop */}

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* Handle filter menu*/}
                    <div className="flex justify-between w-full">
                        <div className="flex justify-start w-fit gap-2">
                            {/* More Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outlinePrimary"
                                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                                    >
                                        <Filter className="text-primary w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md w-fit">
                                    <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                                        Menu Filter
                                    </DropdownMenuLabel>
                                    {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                    <div className="bg-white w-full h-full">
                                        <div className="flex flex-col w-full px-2 py-2">
                                            {/* Filter Kecamatan */}
                                            <div className="w-full">
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Kecamatan" />
                                                <div className="w-full mb-2">
                                                    <KecamatanSelect
                                                        value={selectedKecamatan}
                                                        onChange={(value) => {
                                                            setSelectedKecamatan(value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* Filter Kecamatan */}

                                            {/* Filter Desa */}
                                            {/* Filter Desa */}

                                            {/* Filter Rentang Tanggal */}
                                            {/* Filter Rentang Tanggal */}

                                            {/* Filter Tahun Bulan */}
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Bulan" />
                                                <div className="flex gap-2 justify-between items-center w-full">
                                                    {/* filter tahun */}
                                                    <div className="w-1/2">
                                                        <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Tahun">
                                                                    {tahun ? tahun : "Tahun"}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                                                                {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                                                    const year = startYear + index;
                                                                    return (
                                                                        <SelectItem className='text-xs' key={year} value={year.toString()}>
                                                                            {year}
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {/* filter tahun */}
                                                    {/* Filter bulan */}

                                                    {/* Filter bulan */}
                                                </div>
                                            </>
                                            {/* Filter Tahun Bulan */}

                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* More Menu */}

                            {/* filter kolom */}
                            <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            />
                            {/* filter kolom */}

                            {/* unduh print */}
                            <PSPBantuan
                                urlApi={`/psp/bantuan/get?page=${currentPage}&search=${search}&limit=10&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
                                startDate={filterStartDate}
                                endDate={filterEndDate}
                                kecamatan={selectedKecamatan}
                            />
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <Link
                                href="/psp/bantuan/tambah"
                                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                                {/* Tambah */}
                                <TambahIcon />
                            </Link>
                        </div>
                        {/* Tambah Data */}
                    </div>

                    {/* Hendle Search */}
                    <div className="mt-2 search w-full">
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Cari"
                            value={search}
                            onChange={handleSearchChange}
                            rightIcon={<SearchIcon />}
                            className='border-primary py-2 text-xs'
                        />
                    </div>
                    {/* Hendle Search */}

                </>
            </div>
            {/* Mobile */}

            {/* mobile table */}
            <div className="wrap-table flex-col gap-2 mt-3 flex md:hidden">
                {dataPSP?.data?.data && dataPSP.data.data.length > 0 ? (
                    dataPSP.data.data.map((item, index) => (
                        <div key={index} className="card-table text-[12px] p-4 rounded-2xl border border-[#F5F5F5] bg-white shadow-sm">
                            <div className="wrap-konten flex flex-col gap-2">
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Kecamatan</div>
                                    <div className="konten text-black/80 text-end">{item?.kecamatan?.nama}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Desa</div>
                                    <div className="konten text-black/80 text-end">{item?.desa?.nama}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Jenis Bantuan</div>
                                    <div className="konten text-black/80 text-end">{item?.jenisBantuan}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Periode</div>
                                    <div className="konten text-black/80 text-end">
                                    {item.periode ? new Date(item.periode).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            }) : 'Tanggal tidak tersedia'}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Keterangan</div>
                                    <div className="konten text-black/80 text-end">{item?.keterangan}</div>
                                </div>
                            </div>
                            <div className="garis my-3 w-full h-[2px] bg-[#F5F5F5]"></div>
                            <div className="flex gap-3 text-white">
                                <Link href={`/psp/bantuan/detail/${item.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                    Detail
                                </Link>
                                <Link href={`/psp/bantuan/edit/${item.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(String(item.id) || "")} className="bg-red-500 rounded-full w-full py-2">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        Tidak ada data
                    </div>
                )}
            </div>
            {/* mobile table */}

            {/* table */}
            <div className="hidden md:block">
                <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden'>
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
                            {visibleColumns.includes('aksi') && (
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
            </div>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center justify-end pb-5 lg:pb-0">
                {dataPSP?.data?.pagination?.totalCount as number > 1 && (
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