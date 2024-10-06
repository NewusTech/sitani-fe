"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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
import TambahIcon from '../../../../../../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';
import { useSearchParams, useParams } from 'next/navigation';

const KorluPalawijaDetail = () => {
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

    const { kecamatan, tahun, bulan } = useParams(); // Menangkap parameter dinamis

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataPalawija }: SWRResponse<any> = useSWR(
        // `korluh/palawija/get?limit=1`,
        `/korluh/palawija/get?kecamatan=${kecamatan}&tahun=${tahun}&bulan=${bulan}`,
        (url: string) =>
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
            <div className="text-xl md:text-2xl mb-4 font-semibold text-primary capitalize">Detail Korluh Palawija</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="lg:flex gap-2 lg:justify-start lg:items-center w-full mt-2 lg:mt-4">
                        <Link href="/tanaman-pangan-holtikutura/validasi/palawija" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Kembali
                        </Link>
                        <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                        </div>
                    </div>
                    {/* top */}
                    {/* bulan */}
                    <div className="md:mt-2 mt-1 flex items-center gap-2">
                        <div className="font-semibold">Bulan :</div>
                        <div>
                            {dataPalawija?.data?.data[0]?.tanggal ? (
                                new Date(dataPalawija.data.data[0].tanggal).toLocaleDateString('id-ID', {
                                    month: 'long',
                                    year: 'numeric'
                                })
                            ) : (
                                "-"
                            )}
                        </div>
                    </div>
                    {/* bulan */}

                    {/* kecamatan */}
                    <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">Kecamatan :</div>
                            <div>
                                {dataPalawija?.data?.data[0]?.kecamatan?.nama || "-"}
                            </div>
                        </div>
                    </div>
                    {/* kecamatan */}
                </>
            </div>
            {/* Dekstop */}

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* top */}
                    <div className="lg:flex gap-2 lg:justify-start lg:items-center w-full mt-2 lg:mt-4">
                        <Link href="/tanaman-pangan-holtikutura/validasi/palawija" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Kembali
                        </Link>
                        <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                        </div>
                    </div>
                    {/* top */}
                    <div className="card-table text-xs p-4 rounded-2xl border border-primary bg-white shadow-sm mt-4">
                        {/* bulan */}
                        <div className="md:mt-2 mt-1 flex items-center gap-2">
                            <div className="font-semibold">Bulan :</div>
                            <div>
                                {dataPalawija?.data?.data[0]?.tanggal ? (
                                    new Date(dataPalawija.data.data[0].tanggal).toLocaleDateString('id-ID', {
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>
                        {/* bulan */}

                        {/* kecamatan */}
                        <div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold">Kecamatan :</div>
                                <div>
                                    {dataPalawija?.data?.data[0]?.kecamatan?.nama || "-"}
                                </div>
                            </div>
                        </div>
                        {/* kecamatan */}
                    </div>
                </>
            </div>
            {/* Mobile */}


            {/*Mobile accordion */}
            <div className="md:hidden">
                <Accordion type="single" collapsible className="w-full">
                    {dataPalawija?.data?.data && dataPalawija?.data?.data?.length > 0 ? (
                        dataPalawija.data.data.map((item: any, index: number) => (
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
                                                        {/* JUmlah Jagung */}
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
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.lahanSawahPanenMuda ?? "-"}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex justify-between gap-5">
                                                                            <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                            <div className="konten text-black/80 text-end">
                                                                                {item[17]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
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
                                                                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                                                        <>
                                                                            <Accordion type="single" collapsible className="w-full">
                                                                                <AccordionItem className='' value="item-1">
                                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-0'>A. Hibrida</AccordionTrigger>
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

                                                                                                        </AccordionContent>
                                                                                                    </AccordionItem>
                                                                                                </Accordion>
                                                                                            </>
                                                                                        </div>
                                                                                    </AccordionContent>
                                                                                </AccordionItem>
                                                                                <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
                                                                                <AccordionItem className='' value="item-2">
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

                                                                                    </AccordionContent>
                                                                                </AccordionItem>
                                                                                <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />
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

                                                                                    </AccordionContent>
                                                                                </AccordionItem>
                                                                            </Accordion>
                                                                        </>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>

                                                            <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        </>
                                                        {/* kedelai */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">2.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kedelai</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[19]?.produksi ?? "-"}
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
                                                                                                    {item[5]?.lahanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">					                                            {item[5]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanSawahTanam ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanBukanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanBukanSawahTanam ?? "-"}

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.lahanBukanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[5]?.produksi ?? "-"}
                                                                                                </div>
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
                                                                                                    {item[6]?.lahanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">		                  {item[6]?.lahanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">				  {item[6]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">{item[6]?.lahanSawahTanam ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.lahanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.lahanBukanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.lahanBukanSawahTanam ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.lahanBukanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[6]?.produksi ?? "-"}
                                                                                                </div>
                                                                                            </div>

                                                                                        </AccordionContent>
                                                                                    </AccordionItem>
                                                                                </Accordion>
                                                                            </>
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* kacang tanah */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">3.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kacang Tanah</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[7]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* jumlah ubi kayu singkong */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">4.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jumlah Ubi Kayu Singkong</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[20]?.produksi ?? "-"}
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
                                                                                                    {item[8]?.lahanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">					                                            {item[8]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanSawahTanam ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanBukanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanBukanSawahTanam ?? "-"}

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.lahanBukanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[8]?.produksi ?? "-"}
                                                                                                </div>
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
                                                                                                    {item[9]?.lahanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">		                  {item[9]?.lahanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">				  {item[9]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">{item[9]?.lahanSawahTanam ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.lahanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.lahanBukanSawahPanen ?? "-"}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.lahanBukanSawahTanam ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.lahanBukanSawahPuso ?? "-"}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-between gap-5">
                                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                                <div className="konten text-black/80 text-end">
                                                                                                    {item[9]?.produksi ?? "-"}
                                                                                                </div>
                                                                                            </div>

                                                                                        </AccordionContent>
                                                                                    </AccordionItem>
                                                                                </Accordion>
                                                                            </>
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* ubi jalar ketela/ketela rambut */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">5.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Ubi Jalar Ketela/Ketela Rambat</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[10]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* kacang hijau */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">6.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kacang Hijau</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[11]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* sargum */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">7.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sorgum / Cantel</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[12]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* gandum */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">8.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Gandum</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[13]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* talas */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">9.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Talas</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[14]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* ganyong */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">10.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Ganyong</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[15]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                        <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                                                        {/* umbi lainnya */}
                                                        <>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="label font-medium text-black">11.</div>
                                                                <div className="konten text-black/80 text-end"></div>
                                                            </div>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem className='' value="item-2">
                                                                    <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Umbi Lainnya</AccordionTrigger>
                                                                    <AccordionContent className='text-xs md:text-sm '>
                                                                        <div className="pl-2 pr-2">
                                                                            <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanSawahTanam ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Sawah Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanBukanSawahPanen ?? "-"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Muda</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanBukanSawahPanenMuda ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Untuk Hijauan Pakan Ternak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanBukanSawahPanenHijauanPakanTernak ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Tanam</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanBukanSawahTanam ?? "-"}

                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Lahan Bukan Sawah Panen Puso/Rusak</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.lahanBukanSawahPuso ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-between gap-5">
                                                                                <div className="label font-medium text-black">Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)</div>
                                                                                <div className="konten text-black/80 text-end">
                                                                                    {item[16]?.produksi ?? "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
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
            {/*Mobile accordion */}

            {/*desktop accordion */}
            <div className="hidden md:block">
                <Accordion type="single" collapsible className="w-full">
                    {dataPalawija?.data?.data && dataPalawija?.data?.data?.length > 0 ? (
                        dataPalawija.data.data.map((item: any, index: number) => (
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
                                                    </TableRow>
                                                </>
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
            {/*desktop accordion */}

        </div>
    )
}

export default KorluPalawijaDetail