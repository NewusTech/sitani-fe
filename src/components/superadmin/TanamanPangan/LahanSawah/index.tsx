"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
import TPHLahanSawah from '@/components/Print/Holtilultura/LahanSawah'
import TambahIcon from '../../../../../public/icons/TambahIcon';

// Define the types
interface Kecamatan {
    id: number;
    nama: string;
}

interface LahanSawahDetail {
    id: number;
    tphLahanSawahId: number;
    kecamatanId: number;
    irigasiTeknis: number;
    irigasiSetengahTeknis: number;
    irigasiSederhana: number;
    irigasiDesa: number;
    tadahHujan: number;
    pasangSurut: number;
    lebak: number;
    lainnya: number;
    jumlah: number;
    keterangan: string;
    kecamatan: Kecamatan;
}

interface LahanSawahData {
    detail: {
        tahun: number;
        list: LahanSawahDetail[];
    };
    jumlahIrigasiSetengahTeknis: number;
    jumlahIrigasiSederhana: number;
    jumlahIrigasiTeknis: number;
    jumlahIrigasiDesa: number;
    jumlahPasangSurut: number;
    jumlahTadahHujan: number;
    jumlahLainnya: number;
    jumlahLebak: number;
    jumlah: number;
}

interface Response {
    status: number;
    message: string;
    data: LahanSawahData;
}


const LahanSawah = () => {
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
    const [activeTab, setActiveTab] = useState("lahanSawah");
    // GETALL
    const { data: responseData, error } = useSWR<Response>(
        `tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`,
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

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/tph/lahan-sawah/delete/${id}`, {
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
        mutate(`tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`);
    };
    // DELETE

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Kecamatan", key: "kecamatan" },
        { label: "Luas Lahan Sawah", key: "luasLahanSawah" },
        { label: "Keterangan", key: "keterangan" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "kecamatan", "keterangan", "aksi"];
            } else {
                return ["no", "kecamatan", "luasLahanSawah", "keterangan", "aksi"];
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
                        <TPHLahanSawah
                            urlApi={`tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`}
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
                                        setSelectedKecamatan(value); // Update state with selected value
                                    }}
                                />
                            </div>
                            <Link href="/tanaman-pangan-holtikutura/lahan/lahan-sawah/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
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
                                                <div className="w-full mb-2">
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
                            <TPHLahanSawah
                                urlApi={`tph/lahan-sawah/get?year=${tahun}&kecamatan=${selectedKecamatan}`}
                                kecamatan={selectedKecamatan}
                                tahun={tahun}
                            />
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <Link
                                href="/tanaman-pangan-holtikutura/lahan/lahan-sawah/tambah"
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
                    <TableRow>
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
                        {visibleColumns.includes('luasLahanSawah') && (
                            <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                Luas Lahan Sawah (Ha)
                            </TableHead>
                        )}
                        {visibleColumns.includes('keterangan') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Ket
                            </TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Aksi
                            </TableHead>
                        )}
                    </TableRow>
                    <TableRow>
                        {visibleColumns.includes('luasLahanSawah') && (
                            <>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigasi Teknis
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigas 1/2 Teknis
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigasi Sederhana
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Irigasi Desa
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Tadah Hujan
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Pasang Surut
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Lebak
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Lainnya
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    Jumlah
                                </TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {responseData?.data && responseData?.data?.detail?.list?.length > 0 ? (
                        responseData?.data?.detail?.list.map((item, index) => (
                            <TableRow key={item.id}>
                                {visibleColumns.includes('no') && (
                                    <TableCell className="py-2 lg:py-4 border border-slate-200">{index + 1}</TableCell>
                                )}
                                {visibleColumns.includes('kecamatan') && (
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.kecamatan.nama}</TableCell>
                                )}
                                {visibleColumns.includes('luasLahanSawah') && (
                                    <>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.irigasiTeknis}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.irigasiSetengahTeknis}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.irigasiSederhana}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.irigasiDesa}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.tadahHujan}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.pasangSurut}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.lebak}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.lainnya}</TableCell>
                                        <TableCell className="py-2 lg:py-4 border border-slate-200">{item.jumlah}</TableCell>
                                    </>
                                )}
                                {visibleColumns.includes('keterangan') && (
                                    <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.keterangan}</TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell className="text-center">
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/tanaman-pangan-holtikutura/lahan/lahan-sawah/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link className='' href={`/tanaman-pangan-holtikutura/lahan/lahan-sawah/edit/${item.id}`}>
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
                    <TableRow>
                        {visibleColumns.includes('no') && (
                            <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                            </TableHead>
                        )}
                        {visibleColumns.includes('kecamatan') && (
                            <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                Jumlah
                            </TableHead>
                        )}
                        {visibleColumns.includes('luasLahanSawah') && (
                            <>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiTeknis}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiSetengahTeknis}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiSederhana}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahIrigasiDesa}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahTadahHujan}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahPasangSurut}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahLebak}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlahLainnya}
                                </TableHead>
                                <TableHead className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                                    {responseData?.data?.jumlah}
                                </TableHead>
                            </>
                        )}
                        {visibleColumns.includes('keterangan' || 'aksi') && (
                            <TableHead colSpan={2} className="text-primary font-semibold bg-primary-600 py-1 border border-slate-200 text-center">
                            </TableHead>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default LahanSawah;
