"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../../../public/icons/EyeIcon'
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
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KorluhSayuranMobile from '@/components/KorluhMobile/KorluhSayuranMobile';
import TambahIcon from '../../../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';
import { useSearchParams } from 'next/navigation';


const KorluhSayuranBuah = () => {
    // INTEGRASI
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
    const searchParams = useSearchParams();

    // Ambil query parameters dari URL
    const kecamatan = searchParams.get('kecamatan');
    const tahun = searchParams.get('tahun');
    const bulan = searchParams.get('bulan');


    // GETALL
    const { data: dataSayuran }: SWRResponse<any> = useSWR(
        // `korluh/padi/get?limit=1`,
        `korluh/sayur-buah/get?kecamatan=${kecamatan}&tahun=${tahun}&bulan=${bulan}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log(dataSayuran)

    // INTEGRASI

    // DELETE
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: string) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.delete(`/korluh/sayur-buah/delete/${id}`, {
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
        mutate(`korluh/sayur-buah/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`);
    };
    // DELETE



    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-5 font-semibold text-primary">Korluh Sayuran Buah</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="lg:flex gap-2 lg:justify-start lg:items-center w-full mt-2 lg:mt-4">
                        <Link href="/tanaman-pangan-holtikutura/validasi/sayuran-buah" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Kembali
                        </Link>
                        <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                        </div>
                    </div>
                    {/* top */}
                </>
                {/* bulan */}
                <div className="md:mt-2 mt-1 flex items-center gap-2">
                    <div className="font-semibold">Bulan :</div>
                    <div>
                        {dataSayuran?.data?.data[0]?.tanggal ? (
                            new Date(dataSayuran.data.data[0].tanggal).toLocaleDateString('id-ID', {
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
                            {dataSayuran?.data?.data[0]?.kecamatan?.nama || "-"}
                        </div>
                    </div>
                </div>
                {/* kecamatan */}

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
                                href="/korluh/sayuran-buah/tambah"
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
                            {dataSayuran?.data?.data.map((item: any, index: any) => (
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
                                {dataSayuran?.data?.data.map((item: any, index: any) => (
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
                {dataSayuran?.data?.data && dataSayuran?.data?.data?.length > 0 ? (
                    dataSayuran.data.data.map((item: any, index: number) => (
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
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="w-[150px] text-center items-center">
                                                        Hasil Produksi Yang dicatat
                                                    </div>
                                                </TableHead>
                                                <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                                    <div className="text-center items-center">
                                                        Luas Panen (Hektar)
                                                    </div>
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="w-[150px] text-center items-center">
                                                        Luas Rusak / Tidak Berhasil/Puso (Hektar)
                                                    </div>
                                                </TableHead>
                                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                                    <div className="w-[150px] text-center items-center">
                                                        Luas Penanaman Baru / Tambah Tanam (Hektar)
                                                    </div>
                                                </TableHead>
                                                <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                                    Produksi (Kuintal)
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
                                            {/* Bawang daun */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">A.1</TableCell>
                                                <TableCell className="border border-slate-200">Bawang Daun</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[1]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[1]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Bawang Merah */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">2.</TableCell>
                                                <TableCell className="border border-slate-200">Bawang Merah</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[2]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[2]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Bawang Putih */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">3.</TableCell>
                                                <TableCell className="border border-slate-200">Bawang Putih</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[3]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[3]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Kembang Kol */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">4.</TableCell>
                                                <TableCell className="border border-slate-200">Kembang Kol</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[4]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[4]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Kentang */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">5.</TableCell>
                                                <TableCell className="border border-slate-200">Kentang</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[5]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[5]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Kubis */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">6.</TableCell>
                                                <TableCell className="border border-slate-200">Kubis</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[6]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[6]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Petsai/Sawi */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">7.</TableCell>
                                                <TableCell className="border border-slate-200">Petsai/Sawi</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[7]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[7]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/*  */}
                                            {/* Wortel */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">8.</TableCell>
                                                <TableCell className="border border-slate-200">Wortel</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[8]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[8]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Bayam */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">9.</TableCell>
                                                <TableCell className="border border-slate-200">Bayam</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[9]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[9]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Buncis */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">10.</TableCell>
                                                <TableCell className="border border-slate-200">Buncis</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[10]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[10]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Cabai Besar TW/Teropong */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">11.</TableCell>
                                                <TableCell className="border border-slate-200">Cabai Besar TW/Teropong</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[11]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[11]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Cabai Keriting */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">12.</TableCell>
                                                <TableCell className="border border-slate-200">Cabai Keriting</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[12]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[12]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Cabai Rawit */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">13.</TableCell>
                                                <TableCell className="border border-slate-200">Cabai Rawit</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[13]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[13]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Jamur Tiram */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">14.</TableCell>
                                                <TableCell className="border border-slate-200">Jamur Tiram</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[14]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[14]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Jamur Merang */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">15.</TableCell>
                                                <TableCell className="border border-slate-200">Jamur Merang</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[15]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[15]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Jamur Lainnya */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">16.</TableCell>
                                                <TableCell className="border border-slate-200">Jamur Lainnya</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[16]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[16]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Kacang Panjang */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">17.</TableCell>
                                                <TableCell className="border border-slate-200">Kacang Panjang</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[17]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[17]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Kangkung */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">18.</TableCell>
                                                <TableCell className="border border-slate-200">Kangkung</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[18]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[18]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Mentimun */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">19.</TableCell>
                                                <TableCell className="border border-slate-200">Mentimun</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[19]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[19]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Labu Siam */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">20.</TableCell>
                                                <TableCell className="border border-slate-200">Labu Siam</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[20]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[20]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Paprika */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">21.</TableCell>
                                                <TableCell className="border border-slate-200">Paprika</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[21]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[21]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Terung */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">22.</TableCell>
                                                <TableCell className="border border-slate-200">Terung</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[22]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[22]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Tomat */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">23.</TableCell>
                                                <TableCell className="border border-slate-200">Tomat</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[23]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[23]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Melon */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">B1.</TableCell>
                                                <TableCell className="border border-slate-200">Melon</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[24]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[24]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Semangka */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">2.</TableCell>
                                                <TableCell className="border border-slate-200">Semangka</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[25]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[25]?.keterangan ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                            {/* Stroberi */}
                                            <TableRow>
                                                <TableCell className="border border-slate-200 text-center">3.</TableCell>
                                                <TableCell className="border border-slate-200">Stroberi</TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.hasilProduksi ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.luasPanenHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.luasPanenBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.luasRusak ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.luasPenanamanBaru ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.produksiHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.produksiBelumHabis ?? "-"}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item[26]?.rerataHarga ?? "-"}
                                                </TableCell>
                                                <TableCell className="border border-slate-200 text-center">
                                                    {item[26]?.keterangan ?? "-"}
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

export default KorluhSayuranBuah