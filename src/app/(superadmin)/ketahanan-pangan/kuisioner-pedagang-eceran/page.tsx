"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'
import "react-datepicker/dist/react-datepicker.css";
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
import EyeIcon from '../../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'

import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import PaginationTable from '@/components/PaginationTable'
import FilterTable from '@/components/FilterTable'
import KuisionerPedagangEceranPrint from '@/components/Print/KetahananPangan/Kuisioner-Pedagang-Eceran'
import "react-datepicker/dist/react-datepicker.css";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import TambahIcon from '../../../../../public/icons/TambahIcon'

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

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface ListItem {
    id: number;
    kepangPedagangEceranId: number;
    kepangMasterKomoditasId: number;
    minggu1: number;
    minggu2: number;
    minggu3: number;
    minggu4: number;
    minggu5: number;
    createdAt: string;
    updatedAt: string;
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    mg1: string;
    createdAt: string;
    updatedAt: string;
    list: ListItem[];
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
        data: DataItem[];
        pagination: Pagination;
    };
}

const KuisionerPedagangEceran = () => {
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
    const { data: dataProdusenEceran }: SWRResponse<Response> = useSWR(
        `/kepang/pedagang-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    console.log(dataProdusenEceran)

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/kepang/pedagang-eceran/delete/${id}`, {
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
            mutate(`/kepang/pedagang-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`);
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        }
    };

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Komoditas", key: "komoditas" },
        { label: "MG I", key: "mg1" },
        { label: "MG II", key: "mg2" },
        { label: "MG III", key: "mg3" },
        { label: "MG IV", key: "mg4" },
        { label: "MG V", key: "mg5" },
        { label: "Rata - Rata", key: "rataRata" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "komoditas", "rataRata", "aksi"];
            } else {
                return ["no", "komoditas", "mg1", "mg2", "mg3", "mg4", "mg5", "rataRata", "aksi"];
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
            <div className="text-2xl mb-4 font-semibold text-primary capitalize">Kuesioner Data Harian Panel Pedagangan Eceran</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center">
                        <div className="search md:w-[50%]">
                            <Input
                                type="text"
                                placeholder="Cari"
                                value={search}
                                onChange={handleSearchChange}
                                rightIcon={<SearchIcon />}
                                className='border-primary py-2'
                            />
                        </div>
                        {/* print */}
                        <KuisionerPedagangEceranPrint
                            urlApi={`/kepang/pedagang-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                        />
                        {/* print */}
                    </div>
                    {/*  */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-[70%]">
                            {/* filter tanggal */}
                            <>
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
                                                {startDate ? format(startDate, "dd/MM/yyyy", { locale: id }) : <span>Tanggal Awal</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <DatePicker
                                                inline
                                                selected={startDate}
                                                onChange={(date: any) => setstartDate(date)}
                                                showYearDropdown
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                yearDropdownItemNumber={15}
                                                scrollableYearDropdown
                                                locale={id}
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
                                                {endDate ? format(endDate, "dd/MM/yyyy", { locale: id }) : <span>Tanggal Akhir</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <DatePicker
                                                inline
                                                selected={endDate}
                                                onChange={(date: any) => setendDate(date)}
                                                showYearDropdown
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                yearDropdownItemNumber={15}
                                                scrollableYearDropdown
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </>
                            {/* filter tahun */}
                            <div className="w-fit">
                                <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tahun">
                                            {tahun ? tahun : "Tahun"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Semua Tahun">Semua Tahun</SelectItem>
                                        {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                            const year = startYear + index;
                                            return (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* filter tahun */}
                            {/* filter tanggal */}
                            <div className="w-[40px] h-[40px]">
                                <FilterTable
                                    columns={columns}
                                    defaultCheckedKeys={getDefaultCheckedKeys()}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="w-[30%] mt-4 lg:mt-0">
                            <div className="flex justify-end">
                                <Link href="/ketahanan-pangan/kuisioner-pedagang-eceran/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                                    Tambah Data
                                </Link>
                            </div>
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>

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
                                                        {/* <>
                        <Label className='text-xs mb-1 !text-black opacity-50' label="Kecamatan" />
                        <div className="w-full mb-2">
                          <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                            <SelectTrigger className='text-xs'>
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
                      </> */}
                                                        {/* Filter Kecamatan */}

                                                        {/* Filter Desa */}
                                                        {/* <>
                        <Label className='text-xs mb-1 !text-black opacity-50' label="Desa" />
                        <div className="w-full mb-2">
                          <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                            <SelectTrigger className='text-xs'>
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
                      </> */}
                                                        {/* Filter Desa */}

                                                        {/* Filter Rentang Tanggal */}
                                                        <>
                                                            <Label className='text-xs mb-1 !text-black opacity-50' label="Rentang Tanggal" />
                                                            <div className="flex gap-2 justify-between items-center w-full mb-2">
                                                                <div className="w-full">
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                className={cn(
                                                                                    "w-full flex items-center justify-between text-left font-normal text-[11px] lg:text-sm",
                                                                                    !startDate && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <div className="flex gap-2 justify-between">
                                                                                    <span className="pl-2 text-xs">
                                                                                        {startDate
                                                                                            ? format(startDate, "dd/MM/yyyy", { locale: id })
                                                                                            : "Tanggal Awal"}
                                                                                    </span>
                                                                                    <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                                                                                </div>
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0">
                                                                            <DatePicker
                                                                                inline
                                                                                selected={startDate}
                                                                                onChange={(date: any) => setstartDate(date)}
                                                                                showYearDropdown
                                                                                dateFormat="dd/MM/yyyy"
                                                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                                                yearDropdownItemNumber={15}
                                                                                scrollableYearDropdown
                                                                                locale={id}
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                                <div className="text-xs">to</div>
                                                                <div className="w-full">
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                className={cn(
                                                                                    "w-full flex items-center justify-between text-left font-normal text-xs lg:text-sm",
                                                                                    !endDate && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <div className="flex gap-2 justify-between">
                                                                                    <span className="pl-2 text-xs">
                                                                                        {endDate
                                                                                            ? format(endDate, "dd/MM/yyyy", { locale: id })
                                                                                            : "Tanggal Akhir"}
                                                                                    </span>
                                                                                    <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                                                                                </div>
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0">
                                                                            <DatePicker
                                                                                inline
                                                                                selected={endDate}
                                                                                onChange={(date: any) => setendDate(date)}
                                                                                showYearDropdown
                                                                                dateFormat="dd/MM/yyyy"
                                                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                                                yearDropdownItemNumber={15}
                                                                                scrollableYearDropdown
                                                                                locale={id}
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                            </div>
                                                        </>
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
                                                                {/* Filter bulan */}
                                                            </div>
                                                        </>
                                                        {/* Filter Tahun Bulan */}

                                                    </div>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Menu Filter</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {/* More Menu */}

                            {/* filter kolom */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <FilterTable
                                            columns={columns}
                                            defaultCheckedKeys={getDefaultCheckedKeys()}
                                            onFilterChange={handleFilterChange}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Filter Kolom</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {/* filter kolom */}

                            {/* unduh print */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <KuisionerPedagangEceranPrint
                                            urlApi={`/kepang/pedagang-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Unduh/Print</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href="/ketahanan-pangan/kuisioner-pedagang-eceran/tambah"
                                            className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                                            {/* Tambah */}
                                            <TambahIcon />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tambah Data</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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

            {/* table */}
            <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        {visibleColumns.includes('no') && (
                            <TableHead className="text-primary py-3">No</TableHead>
                        )}
                        {visibleColumns.includes('komoditas') && (
                            <TableHead className="text-primary py-3">Komoditas</TableHead>
                        )}
                        {visibleColumns.includes('mg1') && (
                            <TableHead className="text-primary py-3">MG I</TableHead>
                        )}
                        {visibleColumns.includes('mg2') && (
                            <TableHead className="text-primary py-3">MG II</TableHead>
                        )}
                        {visibleColumns.includes('mg3') && (
                            <TableHead className="text-primary py-3">MG III</TableHead>
                        )}
                        {visibleColumns.includes('mg4') && (
                            <TableHead className="text-primary py-3">MG IV</TableHead>
                        )}
                        {visibleColumns.includes('mg5') && (
                            <TableHead className="text-primary py-3">MG V</TableHead>
                        )}
                        {visibleColumns.includes('rataRata') && (
                            <TableHead className="text-primary py-3">Rata2 Per Bulan</TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead className="text-primary py-3">Aksi</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataProdusenEceran?.data?.data && dataProdusenEceran?.data?.data.length > 0 ? (
                        (() => {
                            let globalIndex = 1; // Inisialisasi global index
                            return dataProdusenEceran.data.data.map((item, index) => (
                                item?.list?.map((citem, cindex) => (
                                    <TableRow key={citem.id}>
                                        {visibleColumns.includes('no') && (
                                            <TableCell>
                                                {globalIndex++}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('komoditas') && (
                                            <TableCell>
                                                {citem?.komoditas.nama}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg1') && (
                                            <TableCell>
                                                {citem?.minggu1}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg2') && (
                                            <TableCell>
                                                {citem?.minggu2}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg3') && (
                                            <TableCell>
                                                {citem?.minggu3}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg4') && (
                                            <TableCell>
                                                {citem?.minggu4}
                                            </TableCell>)}
                                        {visibleColumns.includes('mg5') && (
                                            <TableCell>
                                                {citem?.minggu5}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('rataRata') && (
                                            <TableCell>
                                                {(citem?.minggu1 + citem?.minggu2 + citem?.minggu3 + citem?.minggu4 + citem?.minggu5) / 5}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('aksi') && (
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/ketahanan-pangan/kuisioner-pedagang-eceran/detail/${citem?.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                                    <Link href={`/ketahanan-pangan/kuisioner-pedagang-eceran/edit/${citem?.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <DeletePopup onDelete={() => handleDelete(String(citem?.id))} />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ));
                        })()
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center justify-end">
                {dataProdusenEceran?.data?.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataProdusenEceran?.data?.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default KuisionerPedagangEceran