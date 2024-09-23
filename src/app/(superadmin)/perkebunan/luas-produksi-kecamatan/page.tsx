"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable'
import TambahIcon from '../../../../../public/icons/TambahIcon'
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan'
import FilterTable from '@/components/FilterTable'
import PerkebunanKecamatanPrint from '@/components/Print/Perkebunan/Kecamatan'


const LuasKecPage = () => {
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
    const [bulan, setBulan] = React.useState("1");

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataProduksi }: SWRResponse<any> = useSWR(
        `/perkebunan/kecamatan/get?page=${currentPage}&year=${tahun}&kecamatan=${selectedKecamatan}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "ngrok-skip-browser-warning": true,
                    },
                })
                .then((res: any) => {
                    return res.data;
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    return { status: "error", message: "Failed to fetch data" };
                })
        // .then((res: any) => res.data)
    );

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/perkebunan/kecamatan/delete/${id}`, {
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
        } mutate(`/perkebunan/kecamatan/get?page=${currentPage}&year=${tahun}&kecamatan=${selectedKecamatan}&limit=${limit}`);
    };

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Komoditi", key: "komoditi" },
        { label: "Komposisi Luas Areal", key: "komposisi" },
        { label: "Jumlah", key: "jumlah" },
        { label: "Produksi (Ton)", key: "produksi" },
        { label: "Produktivitas Kg/Ha", key: "produktivitas" },
        { label: "Jml. Petani Pekebun (KK)", key: "jumlahPetani" },
        { label: "Bentuk Hasil	", key: "bentukHasil" },
        { label: "Keterangan", key: "keterangan" },
        { label: "Aksi", key: "aksi" },

    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "komoditi", "aksi"];
            } else {
                return ["no", "komoditi", "komposisi", "jumlah", "produksi", "produktivitas", "jumlahPetani", "bentukHasil", "keterangan", "aksi"];
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
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kecamatan )</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                            {/* filter kolom */}
                            <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            />
                            {/* filter kolom */}

                            <div className="w-fit">
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
                            <div className="w-fit">
                                <KecamatanSelect
                                    value={selectedKecamatan}
                                    onChange={(value) => {
                                        setSelectedKecamatan(value); // Update state with selected value
                                    }}
                                />
                            </div>
                        </div>
                        <PerkebunanKecamatanPrint
                            urlApi={`/perkebunan/kecamatan/get?page=${currentPage}&year=${tahun}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                            kecamatan={selectedKecamatan}
                            tahun={tahun}
                        />
                    </div>
                    {/*  */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2">
                        <div className="keterangan flex gap-2">
                            <div className="nama font-semibold">
                                <div className="">
                                    Kecamatan
                                </div>
                                <div className="">
                                    Tahun
                                </div>
                            </div>
                            <div className="font-semibold">
                                <div className="">:</div>
                                <div className="">:</div>
                            </div>
                            <div className="bulan">
                                {dataProduksi?.data?.data.map((item: any, index: any) => (
                                    <div key={index}>
                                        {item?.kecamatan || "Tidak ada data"}
                                    </div>
                                ))}
                                {dataProduksi?.data?.data.map((item: any, index: any) => (
                                    <div key={index}>
                                        {item?.tahun || "Tidak ada data"}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">

                            <Link href="/perkebunan/luas-produksi-kecamatan/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
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
                                            <div className="w-full mb-2">
                                                <KecamatanSelect
                                                    value={selectedKecamatan}
                                                    onChange={(value) => {
                                                        setSelectedKecamatan(value); // Update state with selected value
                                                    }}
                                                />
                                            </div>
                                            {/* Filter Kecamatan */}

                                            {/* Filter Desa */}
                                            {/* Filter Desa */}

                                            {/* Filter Rentang Tanggal */}
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
                                                    <div className="w-1/2">
                                                        <Select
                                                            onValueChange={(value) => setBulan(value)}
                                                            value={bulan}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Bulan" className='text-2xl' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">Januari</SelectItem>
                                                                <SelectItem value="2">Februari</SelectItem>
                                                                <SelectItem value="3">Maret</SelectItem>
                                                                <SelectItem value="4">April</SelectItem>
                                                                <SelectItem value="5">Mei</SelectItem>
                                                                <SelectItem value="6">Juni</SelectItem>
                                                                <SelectItem value="7">Juli</SelectItem>
                                                                <SelectItem value="8">Agustus</SelectItem>
                                                                <SelectItem value="9">September</SelectItem>
                                                                <SelectItem value="10">Oktober</SelectItem>
                                                                <SelectItem value="11">November</SelectItem>
                                                                <SelectItem value="12">Desember</SelectItem>
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
                            {/* More Menu */}

                            {/* filter kolom */}
                            <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            />
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
                                href="/perkebunan/luas-produksi-kecamatan/tambah"
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

            {/* table */}
            <Table className='border border-slate-200 mt-2'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        {visibleColumns.includes('no') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                No
                            </TableHead>
                        )}
                        {visibleColumns.includes('komoditi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Komoditi
                            </TableHead>
                        )}
                        {visibleColumns.includes('komposisi') && (
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                                Komposisi Luas Areal
                            </TableHead>
                        )}
                        {visibleColumns.includes('jumlah') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Jumlah
                            </TableHead>
                        )}
                        {visibleColumns.includes('produksi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Produksi (Ton)
                            </TableHead>
                        )}
                        {visibleColumns.includes('produktivitas') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Produktivitas Kg/Ha
                            </TableHead>
                        )}
                        {visibleColumns.includes('jumlahPetani') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Jml. Petani Pekebun (KK)
                            </TableHead>
                        )}
                        {visibleColumns.includes('bentukHasil') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Bentuk Hasil
                            </TableHead>
                        )}
                        {visibleColumns.includes('keterangan') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Keterangan
                            </TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 text-center">
                                Aksi
                            </TableHead>
                        )}
                    </TableRow>
                    <TableRow>
                        {visibleColumns.includes('komposisi') && (
                            <>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    TBM
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    TM
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    TR
                                </TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataProduksi?.data?.data && dataProduksi?.data?.data?.length > 0 ? (
                        dataProduksi?.data?.data.map((item: any) => (
                            <>
                                {/* Tahunan */}
                                <TableRow >
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border border-slate-200 font-semibold text-center'>
                                            I
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            TAN. TAHUNAN
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('aksi') && (
                                        <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                    )}
                                </TableRow>
                                {/* komoditas */}
                                {item?.list[1]?.masterIds?.map((i: number) => (
                                    <TableRow key={i}>
                                        {visibleColumns.includes('no') && (
                                            <TableCell className='border border-slate-200 text-center'></TableCell>
                                        )}
                                        {visibleColumns.includes('komoditi') && (
                                            <TableCell className='border border-slate-200'>
                                                {/* Aren */}
                                                {item?.list[1]?.list[i]?.komoditas}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('komposisi') && (
                                            <>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[1]?.list[i]?.tbm}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[1]?.list[i]?.tm}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[1]?.list[i]?.tr}
                                                </TableCell>
                                            </>
                                        )}
                                        {visibleColumns.includes('jumlah') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[1]?.list[i]?.jumlah}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('produksi') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[1]?.list[i]?.produksi}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('produktivitas') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[1]?.list[i]?.produktivitas}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('jumlahPetani') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[1]?.list[i]?.jmlPetaniPekebun}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('bentukHasil') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[1]?.list[i]?.bentukHasil}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('keterangan') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[1]?.list[i]?.keterangan}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('aksi') && (
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${item?.list[1]?.list[i]?.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${item?.list[1]?.list[i]?.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <DeletePopup onDelete={() => handleDelete(String(item?.list[1]?.list[i]?.id))} />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {/* jumlah I */}
                                <TableRow>
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border italic font-semibold border-slate-200'>
                                            Jumlah I
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komposisi') && (
                                        <>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[1]?.sumTbm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[1]?.sumTm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[1]?.sumTr}
                                            </TableCell>
                                        </>
                                    )}
                                    {visibleColumns.includes('jumlah') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[1]?.sumJumlah}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produksi') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[1]?.sumProduksi}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produktivitas') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[1]?.sumProduktivitas}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('jumlahPetani') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[1]?.sumJmlPetaniPekebun}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('bentukHasil') && (
                                        <TableCell className='border border-slate-200' colSpan={2} />
                                    )}
                                </TableRow>

                                {/* Tahunan */}

                                {/* Semusim */}
                                <TableRow>
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border font-semibold border-slate-200 text-center'>
                                            II
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            TAN. SEMUSIM
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('aksi') && (
                                        <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                    )}
                                </TableRow>
                                {/* Komoditas */}
                                {item?.list[2]?.masterIds?.map((i: number) => (
                                    <TableRow key={i}>
                                        {visibleColumns.includes('no') && (
                                            <TableCell className='border border-slate-200 text-center'></TableCell>
                                        )}
                                        {visibleColumns.includes('komoditi') && (
                                            <TableCell className='border border-slate-200'>
                                                {item?.list[2]?.list[i]?.komoditas}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('komposisi') && (
                                            <>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[2]?.list[i]?.tbm}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[2]?.list[i]?.tm}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[2]?.list[i]?.tr}
                                                </TableCell>
                                            </>
                                        )}
                                        {visibleColumns.includes('jumlah') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[2]?.list[i]?.jumlah}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('produksi') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[2]?.list[i]?.produksi}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('produktivitas') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[2]?.list[i]?.produktivitas}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('jumlahPetani') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[2]?.list[i]?.jmlPetaniPekebun}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('bentukHasil') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[2]?.list[i]?.bentukHasil}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('keterangan') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[2]?.list[i]?.keterangan}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('aksi') && (
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${item?.list[2]?.list[i]?.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${item?.list[2]?.list[i]?.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <DeletePopup onDelete={() => handleDelete(String(item?.list[2]?.list[i]?.id))} />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {/* jumlah II */}
                                <TableRow>
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border italic font-semibold border-slate-200'>
                                            Jumlah II
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komposisi') && (
                                        <>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[2]?.sumTbm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[2]?.sumTm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[2]?.sumTr}
                                            </TableCell>
                                        </>
                                    )}
                                    {visibleColumns.includes('jumlah') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[2]?.sumJumlah}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produksi') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[2]?.sumProduksi}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produktivitas') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[2]?.sumProduktivitas}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('jumlahPetani') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[2]?.sumJmlPetaniPekebun}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('bentukHasil') && (
                                        <TableCell className='border border-slate-200' colSpan={2} />
                                    )}
                                </TableRow>
                                {/* Semusim */}

                                {/* Rempah */}
                                <TableRow>
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border font-semibold border-slate-200 text-center'>
                                            III
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border border-slate-200 font-semibold'>
                                            TAN. REMPAH DAN PENYEGAR
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('aksi') && (
                                        <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                    )}
                                </TableRow>
                                {/* Komoditas */}
                                {item?.list[3]?.masterIds?.map((i: number) => (
                                    <TableRow key={i}>
                                        {visibleColumns.includes('no') && (
                                            <TableCell className='border border-slate-200 text-center'></TableCell>
                                        )}
                                        {visibleColumns.includes('komoditi') && (
                                            <TableCell className='border border-slate-200'>
                                                {item?.list[3]?.list[i]?.komoditas}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('komposisi') && (
                                            <>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[3]?.list[i]?.tbm}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[3]?.list[i]?.tm}
                                                </TableCell>
                                                <TableCell className='border border-slate-200 text-center'>
                                                    {item?.list[3]?.list[i]?.tr}
                                                </TableCell>
                                            </>
                                        )}
                                        {visibleColumns.includes('jumlah') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[3]?.list[i]?.jumlah}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('produksi') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[3]?.list[i]?.produksi}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('produktivitas') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[3]?.list[i]?.produktivitas}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('jumlahPetani') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[3]?.list[i]?.jmlPetaniPekebun}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('bentukHasil') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[3]?.list[i]?.bentukHasil}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('keterangan') && (
                                            <TableCell className='border border-slate-200 text-center'>
                                                {item?.list[3]?.list[i]?.keterangan}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('aksi') && (
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${item?.list[3]?.list[i]?.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${item?.list[3]?.list[i]?.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <DeletePopup onDelete={() => handleDelete(String(item?.list[3]?.list[i]?.id))} />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {/* jumlah III */}
                                <TableRow>
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border italic font-semibold border-slate-200'>
                                            Jumlah III
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komposisi') && (
                                        <>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[3]?.sumTbm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[3]?.sumTm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list[3]?.sumTr}
                                            </TableCell>
                                        </>
                                    )}
                                    {visibleColumns.includes('jumlah') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[3]?.sumJumlah}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produksi') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[3]?.sumProduksi}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produktivitas') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[3]?.sumProduktivitas}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('jumlahPetani') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list[3]?.sumJmlPetaniPekebun}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('bentukHasil') && (
                                        <TableCell className='border border-slate-200' colSpan={2} />
                                    )}
                                </TableRow>
                                {/* Rempah */}

                                {/* jumlah semua */}
                                <TableRow >
                                    {visibleColumns.includes('no') && (
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                    )}
                                    {visibleColumns.includes('komoditi') && (
                                        <TableCell className='border italic font-semibold border-slate-200'>
                                            TOTAL I + II + III
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('komposisi') && (
                                        <>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list?.sumTbm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list?.sumTm}
                                            </TableCell>
                                            <TableCell className='border text-center border-slate-200'>
                                                {item?.list?.sumTr}
                                            </TableCell>
                                        </>
                                    )}
                                    {visibleColumns.includes('jumlah') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list?.sumJumlah}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('prduksi') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list?.sumProduksi}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('produktivitas') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list?.sumProduktivitas}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('jumlahPetani') && (
                                        <TableCell className='border text-center border-slate-200'>
                                            {item?.list?.sumJmlPetaniPekebun}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('bentukHasil') && (
                                        <TableCell className='border border-slate-200' colSpan={2} />
                                    )}
                                </TableRow>
                            </>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table >
            {/* table */}
            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataProduksi?.data?.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataProduksi?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div >
    )
}

export default LuasKecPage