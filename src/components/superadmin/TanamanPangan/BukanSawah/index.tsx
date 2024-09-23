"use client"

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
import TambahIcon from '../../../../../public/icons/TambahIcon';

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

    // INTERGASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
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
        { label: "Aksi", key: "aksi" },
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "total", "aksi"];
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
            {/* Dekstop */}
            <div className="hidden md:block">
                <>
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
                                <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tahun">
                                            {tahun ? tahun : "Tahun"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem> */}
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
                </>
            </div>
            {/* Dekstop */}

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* Handle filter menu*/}
                    <div className="flex justify-between w-full mt-4">
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
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Kecamatan" />
                                                <div className="w-full">
                                                    <KecamatanSelect
                                                        value={selectedKecamatan}
                                                        onChange={(value) => {
                                                            setSelectedKecamatan(value);
                                                        }}
                                                    />
                                                </div>
                                            </>
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
                                                    <div className="w-full">
                                                        <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Tahun">
                                                                    {tahun ? tahun : "Tahun"}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {/* <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem> */}
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
                                                    {/* <div className="w-1/2">
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
                                                    </div> */}
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
                            <TPHBukanSawah
                                urlApi={`tph/lahan-bukan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`}
                                kecamatan={selectedKecamatan}
                                tahun={tahun}
                            />
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <Link
                                href="/tanaman-pangan-holtikutura/lahan/bukan-sawah/tambah"
                                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                                {/* Tambah */}
                                <TambahIcon />
                            </Link>
                        </div>
                        {/* Tambah Data */}
                    </div>

                    {/* Hendle Search */}
                    {/* <div className="mt-2 search w-full">
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Cari"
                            value={search}
                            onChange={handleSearchChange}
                            rightIcon={<SearchIcon />}
                            className='border-primary py-2 text-xs'
                        />
                    </div> */}
                    {/* Hendle Search */}

                </>
            </div>
            {/* Mobile */}

            {/* table */}
            <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden'>
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
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>
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
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.tegal}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.ladang}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.perkebunan}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.hutanRakyat}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.padangPengembalaanRumput}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.hutanNegara}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.smtTidakDiusahakan}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.lainnya}
                                        </TableCell>
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item?.jumlahLahanBukanSawah}
                                        </TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('lahanBukanPertanian') && (
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                        {item?.lahanBukanPertanian}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('total') && (
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>
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
                    <TableRow className='bg-primary-600 hover:bg-primary-600'>
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
                        {visibleColumns.includes('lahanBukanPertanian') && (
                            <TableCell className='border font-semibold border-slate-200 text-center'>
                                {responseData?.data?.lahanBukanPertanian}
                            </TableCell>
                        )}
                        {visibleColumns.includes('total') && (
                            <TableCell className='border font-semibold border-slate-200 text-center'>
                                {responseData?.data?.total}

                            </TableCell>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableCell className='border font-semibold border-slate-200 text-center'>
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