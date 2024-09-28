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

import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
// 
import Swal from 'sweetalert2';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import PaginationTable from '@/components/PaginationTable';
import TambahIcon from '../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';

const KorluPalawija = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()
    const formatDate = (date?: Date): string => {
        if (!date) return ""; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };
    const filterDate = formatDate(startDate);
    // console.log(filterDate)
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataPalawija }: SWRResponse<any> = useSWR(
        // `korluh/palawija/get?limit=1`,
        `/korluh/palawija/get?limit=1&page=${currentPage}&equalDate=${filterDate}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // delete
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/korluh/palawija/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
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
            console.log(id)
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
        } mutate(`/korluh/palawija/get?limit=1&page=${currentPage}&equalDate=${filterDate}`);
    };

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-5 font-semibold text-primary uppercase">Korluh Palawija</div>
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
                            {/* <div className="w-full">
                        <Select >
                            <SelectTrigger>
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                            <Link href="/korluh/palawija/tambah" className='bg-primary px-3 md:px-8 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-base mb-3'>
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
                        {dataPalawija?.data?.data.map((item: any, index: any) => (
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
                            {dataPalawija?.data?.data.map((item: any, index: any) => (
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
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md w-fit">
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
                                href="/korluh/palawija/tambah"
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
                    <div className="card-table text-xs p-4 rounded-2xl border border-primary bg-white shadow-sm">
                        <div className="mt-1 flex items-center gap-2 justify-between">
                            <div className="font-semibold">Tanggal:</div>
                            {dataPalawija?.data?.data.map((item: any, index: any) => (
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
                                {dataPalawija?.data?.data.map((item: any, index: any) => (
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
                {dataPalawija?.data?.data && dataPalawija?.data?.data?.length > 0 ? (
                    dataPalawija.data.data.map((item: any, index: number) => (
                        <>
                            <div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                                <div className="wrap-konten flex flex-col gap-2">
                                    <Carousel>
                                        {/* <div className="flex justify-between gap-2 mb-2">
											<CarouselPrevious className='' />
											<CarouselNext className='' />
										</div> */}
                                        <CarouselContent>
                                            <CarouselItem>
                                                <>
                                                    <div className="flex justify-between gap-5">
                                                        <div className="label font-medium text-black">1.</div>
                                                        <div className="konten text-black/80 text-end"></div>
                                                    </div>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem className='' value="item-1">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jumlah Jagung</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 '>
                                                                <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">		            {item[17]?.lahanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">					      {item[17]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanBukanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}

                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanBukanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.lahanBukanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[17]?.produksi ?? "-"}
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        <AccordionItem className='' value="item-2">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>A. Hibrida</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm '>
                                                                <div className="pl-2 pr-2">
                                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanSawahPanen ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanSawahPanenMuda ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanSawahTanam ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanSawahPuso ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanBukanSawahPanen ?? "-"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanBukanSawahTanam ?? "-"}

                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.lahanBukanSawahPuso ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                        <div className="konten text-black/80 text-end">
                                                                            {item[18]?.produksi ?? "-"}
                                                                        </div>
                                                                    </div>
                                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                                                    <>
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem className='' value="item-1">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-0'>1). Bantuan Pemerintah</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm '>
                                                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanSawahPanen ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanSawahPanenMuda ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                        <div className="konten text-black/80 text-end">					                                            {item[1]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanSawahTanam ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanSawahPuso ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanBukanSawahPanen ?? "-"}
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanBukanSawahTanam ?? "-"}

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.lahanBukanSawahPuso ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[1]?.produksi ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                                    <div className="flex gap-3 text-white">
                                                                                        {item[1]?.id && (
                                                                                            <>
                                                                                                <Link href={`/korluh/palawija/detail/${item[1].id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                                    Detail
                                                                                                </Link>
                                                                                                <Link href={`/korluh/palawija/edit/${item[1].id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                                    Edit
                                                                                                </Link>
                                                                                                <div className="w-full">
                                                                                                    <DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item[1].id) || "")} />
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                                                            <AccordionItem className='' value="item-2">
                                                                                <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>2). Non Bantuan Pemerintah</AccordionTrigger>
                                                                                <AccordionContent className='text-xs md:text-sm '>
                                                                                    <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanSawahPanen ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                        <div className="konten text-black/80 text-end">		                  {item[2]?.lahanSawahPanenMuda ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                        <div className="konten text-black/80 text-end">				  {item[2]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                        <div className="konten text-black/80 text-end">{item[2]?.lahanSawahTanam ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanSawahPuso ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanBukanSawahPanen ?? "-"}
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanBukanSawahTanam ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.lahanBukanSawahPuso ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between gap-5">
                                                                                        <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                        <div className="konten text-black/80 text-end">
                                                                                            {item[2]?.produksi ?? "-"}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                                    <div className="flex gap-3 text-white pb-2">
                                                                                        {item[2]?.id && (
                                                                                            <>
                                                                                                <Link href={`/korluh/palawija/detail/${item[2]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                                    Detail
                                                                                                </Link>
                                                                                                <Link href={`/korluh/palawija/edit/${item[2]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                                    Edit
                                                                                                </Link>
                                                                                                <div className="w-full">
                                                                                                    <DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item[2]?.id) || "")} />
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    </>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        <AccordionItem className='' value="item-4">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>B. Komposit</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 '>
                                                                <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanBukanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanBukanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.lahanBukanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[3]?.produksi ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                <div className="flex gap-3 text-white">
                                                                    {item[3]?.id && (
                                                                        <>
                                                                            <Link href={`/korluh/palawija/detail/${item[3]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                Detail
                                                                            </Link>
                                                                            <Link href={`/korluh/palawija/edit/${item[3]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                Edit
                                                                            </Link>
                                                                            <div className="w-full">
                                                                                <DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item[3]?.id) || "")} />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* <AccordionItem className='' value="item-4">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>C. Lokal</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 '>
                                                                <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.produksi ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                <div className="flex gap-3 text-white">
                                                                    {item[4]?.id && (
                                                                        <>
                                                                            <Link href={`/korluh/palawija/detail/${item[4]}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                Detail
                                                                            </Link>
                                                                            <Link href={`/korluh/palawija/edit/${item[4]}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                Edit
                                                                            </Link>
                                                                            <div className="w-full">
                                                                                <DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item[4]) || "")} />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem> */}
                                                        <AccordionItem className='' value="item-3">
                                                            <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>C. Lokal</AccordionTrigger>
                                                            <AccordionContent className='text-xs md:text-sm mb-2 '>
                                                                <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPanen ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahTanam ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.lahanBukanSawahPuso ?? "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-5">
                                                                    <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                    <div className="konten text-black/80 text-end">
                                                                        {item[4]?.produksi ?? "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                                                                <div className="flex gap-3 text-white">
                                                                    {item[4]?.id && (
                                                                        <>
                                                                            <Link href={`/korluh/palawija/detail/${item[4]?.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                                                                Detail
                                                                            </Link>
                                                                            <Link href={`/korluh/palawija/edit/${item[4]?.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
                                                                                Edit
                                                                            </Link>
                                                                            <div className="w-full">
                                                                                <DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item[4]?.id) || "")} />
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
            <div className="hidden md:block" >
                <Table className='border border-slate-200 mt-2'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow >
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                                No
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                                Uraian
                            </TableHead>
                            <TableHead colSpan={5} className="text-primary border border-slate-200 text-center py-1">
                                Lahan Sawah
                            </TableHead>
                            <TableHead colSpan={5} className="text-primary border border-slate-200 text-center py-1">
                                Lahan Bukan Sawah
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
                                Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary text-center py-1 border border-slate-200">
                                Aksi
                            </TableHead>
                        </TableRow>
                        <TableRow >
                            {/* Lahan Sawah */}
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Panen
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Panen Muda
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Panen  Untuk Hijauan Pakan Ternak
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Tanam
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Puso/rusak
                            </TableHead>
                            {/* Lahan Bukan Sawah */}
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Panen
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Panen Muda
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Panen  Untuk Hijauan Pakan Ternak
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Tanam
                            </TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1">
                                Puso/rusak
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataPalawija?.data?.data && dataPalawija?.data?.data?.length > 0 ? (
                            dataPalawija.data.data.map((item: any, index: number) => (
                                <>
                                    {/* jumlah jagung */}
                                    <TableRow>
                                        <TableCell>
                                            1.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            Jumlah Jagung
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[17]?.produksi ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold '>
                                            A. Hibrida
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[18]?.produksi ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 '>
                                            1). Bantuan Pemerintah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[1]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[1]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[1].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[1].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[1].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 '>
                                            2). Non Bantuan Pemerintah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[2]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[2]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[2].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[2].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[2].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold '>
                                            B. Komposit
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[3]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[3]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[3].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[3].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[3].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold '>
                                            C. Lokal
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[4]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[4]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[4].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[4].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[4].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* jumlah jagung */}
                                    {/* Kedelai */}
                                    <TableRow>
                                        <TableCell>
                                            2
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold '>
                                            Kedelai
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[19]?.produksi ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                    {/* Kedelai */}
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 '>
                                            a. Bantuan Pemerintah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[5]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[5]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[5].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[5].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[5].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 '>
                                            b. Non Bantuan Pemerintah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[6]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[6]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[6].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[6].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[6].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Kedelai */}
                                    {/* Kacang Tanah */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            3.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Kacang Tanah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[7]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[7]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[7].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[7].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[7].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Kacang Tanah */}
                                    {/* Jumlah Ubi Kayusingkong */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            4.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Jumlah Ubi Kayu Singkong
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[20]?.produksi ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                    {/* Jumlah Ubi Kayusingkong */}
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 '>
                                            a. Bantuan Pemerintah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[8]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[8]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[8].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[8].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[8].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell className='border border-slate-200 '>
                                            b. Non Bantuan Pemerintah
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[9]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[9]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[9].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[9].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[9].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Jumlah Ubi Kayusingkong */}
                                    {/* Ubi Jalar/Ketela Rambat */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            5.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Ubi Jalar Ketela/Ketela Rambat
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[10]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[10]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[10].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[10].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[10].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Ubi Jalar/Ketela Rambat */}
                                    {/* Kacang Hijau */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            6.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Kacang Hijau
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[11]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[11]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[11].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[11].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[11].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Kacang Hujau */}
                                    {/* Sorgum Centel */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            7.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Sorgum / Cantel
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[12]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[12]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[12].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[12].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[12].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Sorgum Centel */}
                                    {/* Gandum */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            8.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Gandum
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[13]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[13]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[13].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[13].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[13].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Gandum */}
                                    {/* Talas */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            9.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Talas
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[14]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[14]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[14].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[14].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[14].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Talas */}
                                    {/* Ganyong */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            10.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Ganyong
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[15]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[15]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[15].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[15].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[15].id))} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Ganyong */}
                                    {/* umbi lainnya */}
                                    <TableRow>
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            11.
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            Umbi Lainnya
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanBukanSawahPanen ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanBukanSawahPanenMuda ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanBukanSawahTanam ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.lahanBukanSawahPuso ?? "-"}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item[16]?.produksi ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 justify-center">
                                                    {item[16]?.id && (
                                                        <>
                                                            {/* <Link title="Detail" href={`/korluh/palawija/detail/${item[16].id}`}>
                                                            <EyeIcon />
                                                        </Link> */}
                                                            <Link title="Edit" href={`/korluh/palawija/edit/${item[16].id}`}>
                                                                <EditIcon />
                                                            </Link>
                                                            <DeletePopup onDelete={() => handleDelete(String(item[16].id))} />
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
                                <TableCell colSpan={13} className='text-center'>Tidak Ada Data</TableCell>
                            </TableRow>
                        )}
                        {/* Umbi lainnya */}
                    </TableBody>
                </Table>
            </div>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataPalawija?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataPalawija?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default KorluPalawija