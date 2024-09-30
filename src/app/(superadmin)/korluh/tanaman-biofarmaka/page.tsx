"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
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
import TambahIcon from '../../../../../public/icons/TambahIcon';
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

const KorlubTanamanBiofarmaka = () => {
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

    // GETALL
    const { data: dataTanamanBiofarmaka }: SWRResponse<any> = useSWR(
        `/korluh/tanaman-biofarmaka/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}&equalDate=${filterDate}`,
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

    const handleDelete = async (id: string) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.delete(`/korluh/tanaman-biofarmaka/delete/${id}`, {
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
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/korluh/tanaman-biofarmaka/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`);
    };
    // DELETE
    // verifikasi
    const handleVerifikasi = async (id: string) => {
        try {
            // await axiosPrivate.delete(`/korluh/padi/delete/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`,
            //     },
            // });
            console.log(id)
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil diverifikasi!',
                text: 'Data sudah disimpan sistem!',
                timer: 2500,
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
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memverifikasi data!';
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
    };

    const handleTolak = async (id: string, alasan: string) => {
        try {
            // await axiosPrivate.post(`/korluh/padi/tolak/${id}`,
            //     {
            //         alasan: alasan  // Mengirimkan alasan dalam body request
            //     },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`,
            //         },
            //     });
            console.log(`Data dengan ID ${id} ditolak dengan alasan: ${alasan}`);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditolak!',
                text: 'Data sudah disimpan sistem!',
                timer: 2500,
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
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menolak data!';
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
    };
    // verifikasi

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-5 font-semibold text-primary">Korluh Tanaman Biofarmaka</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                        <div className="wrap-filter left gap-2 lg:gap-2 flex justify-start items-center w-full">
                            <div className="md:w-auto w-full">
                                <Popover>
                                    <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal text-[14px] md:text-[11px] lg:text-sm",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                            {startDate ? format(startDate, "PPP") : <span>Pilih Tanggal</span>}
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
                            {/* filter table */}
                            {/* <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div> */}
                            <div className="header flex gap-2 justify-end items-center">
                                <div className="btn flex gap-2">
                                    {/* <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                                <UnduhIcon />
                                <div className="hidden md:block">
                                    Download
                                </div>
                            </Button>
                            <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                                <PrintIcon />
                                <div className="hidden md:block">
                                    Print
                                </div>
                            </Button> */}
                                </div>
                            </div>
                        </div>
                        <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                        <Link
									href="/status-laporan/tanaman-biofarmaka"
									className="bg-blue-500 px-3 md:px-8 py-2 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-base mb-3"
								>
									Cek Status
								</Link>
                            <Link href="/korluh/tanaman-biofarmaka/tambah" className='bg-primary px-3 md:px-8 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-base mb-3'>
                                Tambah
                            </Link>
                        </div>
                    </div>
                    {/* top */}
                    {/* bulan */}
                    <div className="md:mt-2 mt-1 flex items-center gap-2">
                        <div className="font-semibold">
                            Tanggal:
                        </div>
                        {dataTanamanBiofarmaka?.data?.data.map((item: any, index: any) => (
                            <div key={index}>
                                {item.tanggal
                                    ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : 'Tanggal tidak tersedia'}
                            </div>

                        ))}
                    </div>
                    {/* bulan */}
                    {/* kecamatan */}
                    <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">
                                Kecamatan:
                            </div>
                            {dataTanamanBiofarmaka?.data?.data.map((item: any, index: any) => (
                                <div key={index}>
                                    {item?.kecamatan.nama || "Tidak ada data"}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* kecamatan */}
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
								href="/status-laporan/tanaman-biofarmaka"
								className='bg-blue-500 text-xs px-3 rounded-full text-white hover:bg-blue-500/80 border border-blue-500 text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2 mr-2'>
								{/* Tambah */}
								Cek Status
							</Link>
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

            {/* mobile table */}
            <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
                {dataTanamanBiofarmaka?.data?.data && dataTanamanBiofarmaka?.data?.data?.length > 0 ? (
                    dataTanamanBiofarmaka.data.data.map((item: any, index: number) => (
                        <>
                            <div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                                <div className="wrap-konten flex flex-col gap-2">
                                    <Carousel>
                                        <CarouselContent>
                                            <CarouselItem>
                                                {/* Jahe */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">1.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jahe</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[1]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[1]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[1]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[1]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Jeruk Nipis */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">2.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jeruk Nipis</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[2]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[2]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[2]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[2]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Kepulaga */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">3.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kapulaga</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[3]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[3]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[3]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[3]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Kencur */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">4.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kencur</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[4]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[4]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[4]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[4]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Kunyit */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">5.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kunyit</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[5]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[5]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[5]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[5]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Laos/Lengkuas */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">6.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Laos/Lengkuas</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[6]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[6]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[6]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[6]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Lempuyang */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">7.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jeruk Nipis</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[7]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[7]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[7]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[7]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Lidah Buaya */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">8.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Lidah Buaya</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[8]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[8]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[8]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[8]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Mahkota Dewa */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">9.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mahkota Dewa</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[9]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[9]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[9]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[9]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Mengkudu/Pace */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">10.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mengkudu/Pace</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[10]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[10]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[10]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[10]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Sambiloto */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">11.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sambiloto</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[11]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[11]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[11]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[11]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Serai */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">12.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Serai</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[12]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[12]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[12]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[12]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Temuireng */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">13.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Temuireng</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[13]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[13]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[13]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[13]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                </>

                                                {/* Temukunci */}
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">14.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Temukunci</AccordionTrigger>
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
                                                                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
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
                                                                <div className="">
                                                                    {item[14]?.id ? (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/detail/${item[14]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Detail
                                                                                </Link>
                                                                                <Link href={`/korluh/tanaman-biofarmaka/edit/${item[14]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                    Edit
                                                                                </Link>
                                                                                <div className="w-full">
                                                                                    <DeletePopupTitik className="bg-red-500 text-white rounded-full w-full py-2" onDelete={() => handleDelete(String(item[14]?.id) || "")} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                            <div className="flex gap-3 text-white pb-2 w-1/2 justify-center m-auto">
                                                                                <Link href={`/korluh/tanaman-biofarmaka/tambah`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                    Tambah Data
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    )}
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
                        </>
                    ))
                ) : (
                    <div className="text-center">
                        <NotFoundSearch />
                    </div>
                )}
                {/* Umbi lainnya */}
            </div >
            {/* mobile table */}

            {/* table */}
            <div className="hidden md:block">
                {/* table */}
                <div className="tabel-wrap ">
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
                                <TableHead rowSpan={2} className="text-primary text-center py-1 border border-slate-200">
                                    Aksi
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
                            {dataTanamanBiofarmaka?.data?.data && dataTanamanBiofarmaka?.data?.data?.length > 0 ? (
                                dataTanamanBiofarmaka.data.data.map((item: any, index: number) => (
                                    <>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[1]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[1].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[1].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[1].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[2]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[2].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[2].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[2].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[3]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[3].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[3].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[3].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[4]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[4].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[4].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[4].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[5]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[5].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[5].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[5].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[6]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[6].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[6].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[6].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[7]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[7].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[7].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[7].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[8]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[8].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[8].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[8].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[9]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[9].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[9].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[9].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[10]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[10].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[10].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[10].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[11]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[11].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[11].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[11].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[12]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[12].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[12].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[12].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[13]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[13].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[13].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[13].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[14]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[14].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[14].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[14].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
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
                                            <TableCell>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-3 justify-center">
                                                        {item[15]?.id && (
                                                            <>
                                                                <Link title="Detail" href={`/korluh/tanaman-biofarmaka/detail/${item[15].id}`}>
                                                                    <EyeIcon />
                                                                </Link>
                                                                <Link title="Edit" href={`/korluh/tanaman-biofarmaka/edit/${item[15].id}`}>
                                                                    <EditIcon />
                                                                </Link>
                                                                <DeletePopup onDelete={() => handleDelete(String(item[15].id))} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className='text-center'><NotFoundSearch /></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                </div>
            </div>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataTanamanBiofarmaka?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataTanamanBiofarmaka?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default KorlubTanamanBiofarmaka