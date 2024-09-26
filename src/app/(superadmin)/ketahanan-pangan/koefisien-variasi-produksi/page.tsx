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
import DeletePopupTitik from '@/components/superadmin/TitikDelete'
import NotFoundSearch from '@/components/SearchNotFound'
// Filter di mobile

const KoefisienVariasiProduksi = () => {
    // Fungsi untuk mengubah format bulan menjadi nama bulan
    const getMonthName = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date); // 'id-ID' untuk bahasa Indonesia
    };

    // INTEGRASI
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
        gkgTkPenggilingan: number;
        jpk: number;
        cabaiMerahKeriting: number;
        berasMedium: number;
        berasPremium: number;
        stokGkg: number;
        stokBeras: number;
        createdAt: string; // ISO date string
        updatedAt: string; // ISO date string
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
    const { data: dataProduksi }: SWRResponse<Response> = useSWR(
        `/kepang/cv-produksi/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`,
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
            await axiosPrivate.delete(`/kepang/cv-produksi/delete/${id}`, {
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
            <div className="md:text-2xl text-xl mb-5 font-semibold text-primary">Data Coefesien Variansi (CV) Tk. Produksi</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center">
                        <div className="search md:w-[50%]">
                            {/* <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    /> */}
                        </div>
                        {/* print */}
                        <KoefisienVariasiProduksiPrint
                            urlApi={`/kepang/cv-produksi/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                            tahun={tahun}
                        />
                        {/* print */}
                    </div>
                    {/* top */}
                    <div className="flex gap-2 lg:justify-between lg:items-center w-full mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
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
                            <div className="w-[40px] h-[40px]">
                                <FilterTable
                                    columns={columns}
                                    defaultCheckedKeys={getDefaultCheckedKeys()}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-end">
                                <Link href="/ketahanan-pangan/koefisien-variasi-produksi/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outlinePrimary"
                                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                                    >
                                        <Filter className="text-primary w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md ml-5 w-[280px]">
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
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun" />
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
                            <KoefisienVariasiProduksiPrint
                                urlApi={`/kepang/cv-produksi/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                                tahun={tahun}
                            />
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href="/ketahanan-pangan/koefisien-variasi-produksi/tambah"
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

            {/* mobile table */}
            <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
                {dataProduksi?.data && dataProduksi?.data?.length > 0 ? (
                    dataProduksi?.data?.map((item, index) => (
                        <div key={index} className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                            <div className="wrap-konten flex flex-col gap-2">
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Bulan</div>
                                    <div className="konten text-black/80 text-end">{getMonthName(item.bulan) ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">% Panen</div>
                                    <div className="konten text-black/80 text-end">{item?.panen ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">GKP Tk. Petani</div>
                                    <div className="konten text-black/80 text-end">{item?.gkpTkPetani ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">GKP Tk. Penggilingan</div>
                                    <div className="konten text-black/80 text-end">{item?.gkpTkPenggilingan ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">GKG Tk. Penggilingan</div>
                                    <div className="konten text-black/80 text-end">{item?.gkgTkPenggilingan ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">JPK</div>
                                    <div className="konten text-black/80 text-end">{item?.jpk ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Cabai Merah Keriting</div>
                                    <div className="konten text-black/80 text-end">{item?.cabaiMerahKeriting ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Beras Medium</div>
                                    <div className="konten text-black/80 text-end">{item?.berasMedium ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Beras Premium</div>
                                    <div className="konten text-black/80 text-end">{item?.berasPremium ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Stok GKG</div>
                                    <div className="konten text-black/80 text-end">{item?.stokGkg ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Stok Beras</div>
                                    <div className="konten text-black/80 text-end">{item?.stokBeras ?? "-"}</div>
                                </div>
                            </div>
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                            <div className="flex gap-3 text-white">
                                <Link href={`/ketahanan-pangan/koefisien-variasi-produksi/detail/${item.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                    Detail
                                </Link>
                                <Link href={`/ketahanan-pangan/koefisien-variasi-produksi/edit/${item.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                    Edit
                                </Link>
                                <div className="w-full">
                                    <DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item.id) || "")} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <NotFoundSearch />
                    </div>
                )}
            </div>
            {/* mobile table */}

            {/* table */}
            <div className="hidden md:block">
                <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden'>
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
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                        {/* {index + 1} */}
                                        {(currentPage - 1) * limit + (index + 1)}
                                    </TableCell>
                                    {/* )} */}
                                    {/* {visibleColumns.includes('bulan') && ( */}
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                        {getMonthName(item.bulan)}
                                    </TableCell>
                                    {/* )} */}
                                    {visibleColumns.includes('panen') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.panen}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('gkpPetani') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.gkpTkPetani}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('gkpPenggilingan') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.gkpTkPenggilingan}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('gkgPenggilingan') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.gkgTkPenggilingan}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('jpk') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.jpk}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('cabaiMerahKeriting') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.cabaiMerahKeriting}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('berasMedium') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.berasMedium}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('berasPremium') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.berasPremium}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('stokGKG') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
                                            {item.stokGkg}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('stokBeras') && (
                                        <TableCell className='py-2 lg:py-4 border border-slate-200'>
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
            </div>
            {/* table */}
        </div>
    )
}

export default KoefisienVariasiProduksi