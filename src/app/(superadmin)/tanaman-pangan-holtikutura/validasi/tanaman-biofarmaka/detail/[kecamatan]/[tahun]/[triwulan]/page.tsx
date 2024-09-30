"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../../../../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../../../../../../public/icons/EyeIcon'
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
// Filter di mobile
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
import TambahIcon from '../../../../../../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';

import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Swal from 'sweetalert2';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import PaginationTable from '@/components/PaginationTable';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KorluhBiofarMobile from '@/components/KorluhMobile/KorluhBiofarmakaMob';
import { useSearchParams, useParams } from 'next/navigation';

const KorlubTanamanBiofarmakaDetail = () => {
    // INTEGRASI
    interface KorluhTanamanBiofarmakaResponse {
        status: number;
        message: string;
        data: {
            data: KorluhTanamanBiofarmaka[];
            pagination: Pagination;
        };
    }

    interface KorluhTanamanBiofarmaka {
        id: number;
        kecamatanId: number;
        desaId: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
        list: Tanaman[];
    }

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

    interface Tanaman {
        id: number;
        KorluhTanamanBiofarmakaId: number;
        namaTanaman: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        rerataHarga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
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
    const filterDate = formatDate(startDate);
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
    const [limit, setLimit] = useState(1);
    // limit
    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    // bulan
    const [bulan, setBulan] = useState<string>("");

    const { kecamatan, tahun, triwulan } = useParams();

    // Konversi triwulan dari string ke number
    const triwulanNumber: number = parseInt(triwulan as string, 10);

    const bulanOptions = [
        { value: "1", label: "Januari" },
        { value: "2", label: "Februari" },
        { value: "3", label: "Maret" },
        { value: "4", label: "April" },
        { value: "5", label: "Mei" },
        { value: "6", label: "Juni" },
        { value: "7", label: "Juli" },
        { value: "8", label: "Agustus" },
        { value: "9", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ];

    let filteredBulanOptions: any[];

    switch (triwulanNumber) {
        case 1:
            filteredBulanOptions = bulanOptions.slice(0, 3); // Januari, Februari, Maret
            break;
        case 2:
            filteredBulanOptions = bulanOptions.slice(3, 6); // April, Mei, Juni
            break;
        case 3:
            filteredBulanOptions = bulanOptions.slice(6, 9); // Juli, Agustus, September
            break;
        case 4:
            filteredBulanOptions = bulanOptions.slice(9, 12); // Oktober, November, Desember
            break;
        default:
            filteredBulanOptions = [];
    }

    // Function to get the months for the selected triwulan
    const getBulanForTriwulan = (triwulan: number) => {
        switch (triwulan) {
            case 1:
                return "Triwulan 1 (Januari - Maret)"; // Triwulan 1
            case 2:
                return "Triwulan 2 (April - Juni)"; // Triwulan 2
            case 3:
                return "Triwulan 3 (Juli - September)"; // Triwulan 3
            case 4:
                return "Triwulan 4 (Oktober - Desember)"; // Triwulan 4
            default:
                return "";
        }
    };

    // Function to set the starting month for each triwulan
    const getStartingBulanForTriwulan = (triwulan: number): number => {
        switch (triwulan) {
            case 1:
                return 1; // January
            case 2:
                return 4; // April
            case 3:
                return 7; // July
            case 4:
                return 10; // October
            default:
                return 1;
        }
    };

    // Update bulan whenever triwulan changes
    useEffect(() => {
        if (triwulanNumber) {
            const startingBulan = getStartingBulanForTriwulan(triwulanNumber);
            setBulan(startingBulan.toString()); // Ensure you're setting a string
        }
    }, [triwulanNumber]);


    // GETALL
    const { data: dataTanamanBiofarmaka }: SWRResponse<any> = useSWR(
        `/korluh/tanaman-biofarmaka/get?kecamatan=${kecamatan}&tahun=${tahun}&triwulan=${triwulan}&bulan=${bulan}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log(dataTanamanBiofarmaka)

    // INTEGRASI

    // DELETE
    const [loading, setLoading] = useState(false);

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-5 font-semibold text-primary">Detail Korluh Tanaman Biofarmaka</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                        <Link href="/tanaman-pangan-holtikutura/validasi/tanaman-biofarmaka" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Kembali
                        </Link>
                        <div className="w-[170px]">
                            <Select onValueChange={(value) => setBulan(value)} value={bulan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredBulanOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* top */}
                </>
                {/* kecamatan */}
                <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                    <div className="flex items-center gap-2">
                        <div className="font-semibold">Kecamatan :</div>
                        <div>
                            {dataTanamanBiofarmaka?.data?.data[0]?.kecamatan?.nama || "-"}
                        </div>
                    </div>
                </div>
                {/* kecamatan */}
                {/* Triwulan */}
                <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                    <div className="flex items-center gap-2">
                        <div className="font-semibold">Triwulan :</div>
                        <div>
                        {getBulanForTriwulan(triwulanNumber)}
                        </div>
                    </div>
                </div>
                {/* Triwulan */}
                {/* bulan */}
                <div className="md:mt-2 mt-1 flex items-center gap-2">
                    <div className="font-semibold">Bulan :</div>
                    <div>
                        {dataTanamanBiofarmaka?.data?.data[0]?.tanggal ? (
                            new Date(dataTanamanBiofarmaka.data.data[0].tanggal).toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric'
                            })
                        ) : (
                            "-"
                        )}
                    </div>
                </div>
                {/* bulan */}

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
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md w-fit ml-5">
                                    <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                                        Menu Filter
                                    </DropdownMenuLabel>
                                    {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                    <div className="bg-white w-full h-full">
                                        <div className="flex flex-col w-full px-2 py-2">
                                            {/* Filter Kecamatan */}
                                            {/* <div className="w-full mb-2">
												
											</div> */}
                                            {/* Filter Kecamatan */}

                                            {/* Filter Desa */}
                                            {/* Filter Desa */}

                                            {/* Filter Rentang Tanggal */}
                                            {/* Filter Rentang Tanggal */}

                                            {/* Filter Tahun Bulan */}
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tanggal" />
                                                <div className="flex gap-2 justify-between items-center w-full">
                                                    {/* filter tahun */}
                                                    <Popover>
                                                        <PopoverTrigger
                                                            className="lg:py-4 lg:px-4 px-2"
                                                            asChild
                                                        >
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal text-xs md:text-sm",
                                                                    !startDate && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                                                {startDate ? (
                                                                    format(startDate, "PPP")
                                                                ) : (
                                                                    <span>Pilih Tanggal</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                className=""
                                                                mode="single"
                                                                selected={startDate}
                                                                onSelect={setstartDate}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
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
                            {/* <FilterTable
								columns={columns}
								defaultCheckedKeys={getDefaultCheckedKeys()}
								onFilterChange={handleFilterChange}
							/> */}
                            {/* filter kolom */}

                            {/* unduh print */}
                            {/* <KetahananPanganProdusenEceranPrint
                                urlApi={`/kepang/produsen-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                            /> */}
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <Link
                                href="/korluh/tanaman-biofarmaka/tambah"
                                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                                {/* Tambah */}
                                <TambahIcon />
                            </Link>
                        </div>
                        {/* Tambah Data */}
                    </div>

                    {/* Hendle Search */}
                    <div className="mt-2 search w-full">
                        {/* <Input
							autoFocus
							type="text"
							placeholder="Cari"
							value={search}
							onChange={handleSearchChange}
							rightIcon={<SearchIcon />}
							className='border-primary py-2 text-xs'
						/> */}
                    </div>
                    {/* Hendle Search */}
                    <div className="card-table text-xs p-4 rounded-2xl border border-primary bg-white shadow-sm mt-4">
                        <div className="flex items-center gap-2 justify-between">
                            <div className="font-semibold">Tanggal:</div>
                            {dataTanamanBiofarmaka?.data?.data.map((item: any, index: any) => (
                                <div key={index}>
                                    {item.tanggal
                                        ? new Date(item.tanggal).toLocaleDateString(
                                            "id-ID",
                                            {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )
                                        : "Tanggal tidak tersedia"}
                                </div>
                            ))}
                        </div>
                        {/* bulan */}
                        {/* kecamatan */}
                        <div className="wrap mt-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2 justify-between">
                                <div className="font-semibold">Kecamatan:</div>
                                {dataTanamanBiofarmaka?.data?.data.map((item: any, index: any) => (
                                    <div key={index}>
                                        {item?.kecamatan.nama || "Tidak ada data"}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            </div>
            {/* Mobile */}

            {/* accordion */}
            <Accordion type="single" collapsible className="w-full">
                {dataTanamanBiofarmaka?.data?.data && dataTanamanBiofarmaka?.data?.data?.length > 0 ? (
                    dataTanamanBiofarmaka.data.data.map((item: any, index: number) => (
                        <AccordionItem className="mt-2" value={`${index}`} key={item.id || index}>
                            <AccordionTrigger className="border border-primary p-3 rounded-lg">
                                {item.tanggal
                                    ? new Date(item.tanggal).toLocaleDateString(
                                        "id-ID",
                                        {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )
                                    : "Tanggal tidak tersedia"}
                            </AccordionTrigger>
                            <AccordionContent className="border border-primary p-3 rounded-lg mt-1">
                                <div className="hidden md:block">
                                    <Table className='border border-slate-200 mt-4'>
                                        <TableHeader className='bg-primary-600'>
                                            <TableRow >
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    No
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="text-center items-center">
                                                        Nama Tanaman
                                                    </div>
                                                </TableHead>
                                                <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                                    <div className="text-center items-center">
                                                        Luas Panen (m2)
                                                    </div>
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="w-[150px] text-center items-center">
                                                        Luas Rusak / Tidak Berhasil / Puso (m2)
                                                    </div>
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="w-[150px] text-center items-center">
                                                        Luas Penanaman Baru / Tambah Tanam (m2)
                                                    </div>
                                                </TableHead>
                                                <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                                    Produksi (Kilogram)
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="w-[150px] text-center items-center">
                                                        Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)
                                                    </div>
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    Keterangan
                                                </TableHead>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                                    Habis / <br /> Dibongkar
                                                </TableHead>
                                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                                    Belum Habis
                                                </TableHead>
                                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                                    Dipanen Habis / Dibongkar
                                                </TableHead>
                                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                                    Belum Habis
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Jahe */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    1.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Jahe
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Jeruk Nipis */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    2.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Jeruk Nipis
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Kapulaga */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    3.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Kepulaga
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Kencur */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    4.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Kencur
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Kunyit */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    5.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Kunyit
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Laos/Lengkuas */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    6.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Laos/Lengkuas
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Lempuyang */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    7.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Lempuyang
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Lidah Buaya */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    8.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Lidah Buaya
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Mahkota Dewa */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    9.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Mahkota Dewa
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Mengkudu/Pace */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    10.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Mengkudu/Pace
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Sambiloto */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    11.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Sambiloto
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Serai */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    12.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Serai
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Temuireng */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    13.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Temuireng
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Temukunci */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    14.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Temukunci
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Temulawak */}
                                            <TableRow >
                                                <TableCell className='border border-slate-200 text-center'>
                                                    15.
                                                </TableCell>
                                                <TableCell className='border border-slate-200'>
                                                    Temulawak
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))
                ) : (
                    <div className="text-center">
                        <NotFoundSearch />
                    </div>
                )}
            </Accordion>
            {/* accordion */}

        </div>
    )
}

export default KorlubTanamanBiofarmakaDetail