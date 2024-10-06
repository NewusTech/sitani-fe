"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../../../../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../../../../../../public/icons/FilterIcon'
import Link from 'next/link'
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
import TambahIcon from '../../../../../../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';
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
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import PaginationTable from '@/components/PaginationTable';
import KorluhTanamanHiasMobile from '@/components/KorluhMobile/KorluhTanamanHias';
import { useSearchParams, useParams } from 'next/navigation';


const KorluhTanamanHias = () => {
    // INTEGRASI
    interface KorluhTanamanHiasResponse {
        status: number;
        message: string;
        data: {
            data: KorluhTanamanHias[];
            pagination: Pagination;
        };
    }

    interface KorluhTanamanHias {
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
        korluhTanamanHiasId: number;
        namaTanaman: string;
        satuanProduksi: string;
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
    const { data: dataTanaman }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `korluh/tanaman-hias/get?kecamatan=${kecamatan}&tahun=${tahun}&triwulan=${triwulan}&bulan=${bulan}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log(dataTanaman)

    // INTEGRASI

    // DELETE
    const [loading, setLoading] = useState(false);


    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-5 font-semibold text-primary">Detail Korluh Tanaman Hias</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                        <Link href="/tanaman-pangan-holtikutura/validasi/tanaman-hias" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
                            {dataTanaman?.data?.data[0]?.kecamatan?.nama || "-"}
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
                        {dataTanaman?.data?.data[0]?.tanggal ? (
                            new Date(dataTanaman.data.data[0].tanggal).toLocaleDateString('id-ID', {
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
                    {/* top */}
                    <div className="flex gap-2 justify-between items-center w-full mt-2 lg:mt-4">
                        <Link href="/tanaman-pangan-holtikutura/validasi/tanaman-hias" className='bg-white px-6 md:text-base text-sm rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Kembali
                        </Link>
                        <div className="w-[140px] text-sm">
                            <Select onValueChange={(value) => setBulan(value)} value={bulan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" className="text-sm"/>
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
                <div className="card-table text-xs p-4 rounded-2xl border border-primary bg-white shadow-sm mt-4">
                    {/* kecamatan */}
                    <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">Kecamatan :</div>
                            <div>
                                {dataTanaman?.data?.data[0]?.kecamatan?.nama || "-"}
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
                            {dataTanaman?.data?.data[0]?.tanggal ? (
                                new Date(dataTanaman.data.data[0].tanggal).toLocaleDateString('id-ID', {
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
            </div>
            {/* Mobile */}

            {/* mobile accordion */}
            <div className="md:hidden">
                <Accordion type="single" collapsible className="w-full">
                    {dataTanaman?.data?.data && dataTanaman?.data?.data?.length > 0 ? (
                        dataTanaman.data.data.map((item: any, index: number) => (
                            <AccordionItem className="mt-2" value={`${index}`} key={item.id || index}>
                                <AccordionTrigger className="border border-primary p-3 rounded-lg text-sm">
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
                                    <div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                                        <div className="wrap-konten flex flex-col gap-2">
                                            <Carousel>
                                                <CarouselContent>
                                                    <CarouselItem>
                                                        {/* Anggrek Potong */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">1.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Anggrek Potong</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[1]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[1]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[1]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[1]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[1]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>
                                                        {/* Gerbera (Herbras) */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">2.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Gerbera (Herbras)</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[2]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[2]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[2]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[2]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[2]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Krisan */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">3.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Krisan</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[3]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[3]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[3]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[3]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[3]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[3]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[3]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[3]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[3]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Mawar */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">4.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mawar</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[4]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[4]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[4]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[4]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[4]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[4]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[4]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[4]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[4]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Sedap Malam */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">5.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sedap Malam</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[5]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[5]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[5]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[5]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[5]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[5]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[5]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[5]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[5]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Aglaonema */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">6.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Aglaonema</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[6]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[6]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[6]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[6]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[6]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[6]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[6]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[6]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[6]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Anggrek Pot** */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">7.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Anggrek Pot**</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[7]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[7]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[7]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[7]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[7]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[7]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[7]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[7]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[7]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Anthurium Bunga */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">8.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Anthurium Bunga</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[8]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[8]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[8]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[8]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[8]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[8]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[8]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[8]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[8]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Bromelia */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">9.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bromelia</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[9]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[9]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[9]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[9]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[9]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[9]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[9]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[9]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[9]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Bugenvil */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">10.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Bugenvil</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[10]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[10]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[10]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[10]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[10]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[10]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[10]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[10]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[10]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Cordyline */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">11.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Cordyline</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[11]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[11]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[11]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[11]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[11]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[11]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[11]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[11]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[11]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Dracaena */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">12.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Dracaena</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[12]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[12]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[12]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[12]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[12]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[12]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[12]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[12]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[12]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Heliconia (Pisang-pisangan) */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">13.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Heliconia (Pisang-pisangan)</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[13]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[13]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[13]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[13]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[13]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[13]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[13]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[13]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[13]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Ixora (Soka) */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">14.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Ixora (Soka)</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[14]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[14]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[14]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[14]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[14]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[14]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[14]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[14]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[14]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Pakis */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">15.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Pakis</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[15]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[15]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[15]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[15]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[15]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[15]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[15]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[15]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[15]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Palem */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">16.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Palem</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[16]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[16]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[16]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[16]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[16]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[16]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[16]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[16]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[16]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Phylodendron */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">17.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Phylodendron</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[17]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[17]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[17]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[17]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Puring */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">18.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Puring</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[18]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[18]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[18]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[18]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[18]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[18]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[18]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[18]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[18]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Sansevierie (Lidah mertua) */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">19.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sansevierie</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[19]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[19]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[19]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[19]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[19]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[19]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[19]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[19]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[19]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>

                                                        {/* Melati */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">20.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-1">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Melati</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[20]?.luasPanenHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[20]?.luasPanenBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[20]?.luasRusak ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[20]?.luasPenanamanBaru ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[20]?.produksiHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Belum Habis</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[20]?.produksiBelumHabis ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Satuan Produksi</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[20]?.satuanProduksi ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[20]?.rerataHarga ?? "-"}

                                                                            </div>
                                                                        </div>
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Keterangan</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[20]?.keterangan ?? "-"}
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>
                                                    </CarouselItem>
                                                </CarouselContent>
                                            </Carousel>
                                        </div>
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
            </div>
            {/* mobile accordion */}

            {/* desktop accordion */}
            <div className="hidden md:block">
                <Accordion type="single" collapsible className="w-full">
                    {dataTanaman?.data?.data && dataTanaman?.data?.data?.length > 0 ? (
                        dataTanaman.data.data.map((item: any, index: number) => (
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
                                                        Produksi
                                                    </TableHead>
                                                    <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                        Satuan Produksi
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
                                                {/* Anggrek Potong */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        1.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Anggrek Potong
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[1]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[1]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[1]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Gerbera (Herbras) */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        2.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Gerbera (Herbras)
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[2]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[2]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[2]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Krisan */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        3.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Krisan
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[3]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[3]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[3]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Mawar */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        4.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Mawar
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[4]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[4]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[4]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Sedap Malam */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        5.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Sedap Malam
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[5]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[5]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[5]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Aglaonema */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        6.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Aglaonema
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[6]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[6]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[6]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Anggrek Pot** */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        7.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Anggrek Pot**
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[7]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[7]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[7]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Anthurium Bunga */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        8.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Anthurium Bunga
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[8]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[8]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[8]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Bromelia */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        9.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Bromelia
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[9]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[9]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[9]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Bugenvil */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        10.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Bugenvil
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[10]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[10]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[10]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Cordyline */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        11.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Cordyline
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[11]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[11]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[11]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Dracaena */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        12.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Dracaena
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[12]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[12]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[12]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Heliconia (Pisang-pisangan) */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        13.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Heliconia (Pisang-pisangan)
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[13]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[13]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[13]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Ixora (Soka) */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        14.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Ixora (Soka)
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[14]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[14]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[14]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Pakis */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        15.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Pakis
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
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[15]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[15]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[15]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Palem */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        16.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Palem
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.luasPanenHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.luasPanenBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.luasRusak ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.luasPenanamanBaru ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.produksiHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.produksiBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[16]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[16]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Phylodendron */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        17.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Phylodendron
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.luasPanenHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.luasPanenBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.luasRusak ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.luasPenanamanBaru ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.produksiHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.produksiBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[17]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[17]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Puring */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        18.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Puring
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.luasPanenHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.luasPanenBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.luasRusak ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.luasPenanamanBaru ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.produksiHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.produksiBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[18]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[18]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Sansevierie (Lidah mertua) */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        19.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Sansevierie (Lidah mertua)
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.luasPanenHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.luasPanenBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.luasRusak ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.luasPenanamanBaru ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.produksiHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.produksiBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[19]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[19]?.keterangan ?? "-"}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Melati */}
                                                <TableRow>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        20.
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200'>
                                                        Melati
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.luasPanenHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.luasPanenBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.luasRusak ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.luasPenanamanBaru ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.produksiHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.produksiBelumHabis ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='text-center border border-slate-200'>
                                                        {item[20]?.satuanProduksi ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.rerataHarga ?? "-"}
                                                    </TableCell>
                                                    <TableCell className='border border-slate-200 text-center'>
                                                        {item[20]?.keterangan ?? "-"}
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
            </div>
            {/* desktop accordion */}


        </div>
    )
}

export default KorluhTanamanHias