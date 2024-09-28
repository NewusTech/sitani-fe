"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarDays, Calendar as CalendarIcon, CalendarSearch } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// Filter di mobile

import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
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
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import PaginationTable from '@/components/PaginationTable'
import Swal from 'sweetalert2';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan'
import FilterTable from '@/components/FilterTable'
import PenyuluhKecPrint from '@/components/Print/Penyuluhan/PenyuluhanKec'
import TambahIcon from '../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';

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

interface KelompokTani {
    id: number;
    idPoktan: number;
    kecamatanId: number;
    desaId: number;
    tahun: number;
    nama: string;
    ketua: string;
    sekretaris: string;
    bendahara: string;
    alamat: string;
    dibent: number;
    l: number;
    p: number;
    kelas: string;
    createdAt: string;
    updatedAt: string;
    kecamatan: Kecamatan;
    desa: Desa;
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
        data: KelompokTani[];
        pagination: Pagination;
    };
}


const PenyuluhDataPoktan = () => {
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
    const { data: dataPoktan }: SWRResponse<Response> = useSWR(
        // `/penyuluh-kelompok-tani/get`,
        `/penyuluh-kelompok-tani/get?page=${currentPage}&year=${tahun}&search=${search}&tahun=${tahun}&kecamatan=${selectedKecamatan}&limit=${limit}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/penyuluh-kelompok-tani/delete/${id}`, {
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
        } mutate(`/penyuluh-kelompok-tani/get`);
    };

    // console.log(dataPoktan);

    // Filter table
    const columns = [
        { label: "Kecamatan", key: "kecamatanData" },
        { label: "Wilayah Desa Binaan", key: "wilayah" },
        { label: "Nama", key: "nama" },
        { label: "NIP", key: "nip" },
        { label: "Pangkat", key: "pangkat" },
        { label: "Golongan", key: "golongan" },
        { label: "Keterangan", key: "keterangan" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["kecamatanData", "wilayah", "aksi"];
            } else {
                return ["kecamatanData", "wilayah", "nama", "nip", "pangkat", "golongan", "keterangan", "aksi"];
            }
        }
        return [];
    };

    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setVisibleColumns(getDefaultCheckedKeys());
        const handleResize = () => {
            setVisibleColumns(getDefaultCheckedKeys());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            <div className="md:text-2xl text-xl mb-5 font-semibold text-primary">Data Kelompok Tani (POKTAN) Kabupaten</div>
            {/* title */}
            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center">
                        <div className="search md:w-[50%]">
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Cari"
                                value={search}
                                onChange={handleSearchChange}
                                rightIcon={<SearchIcon />}
                                className='border-primary py-2'
                            />
                        </div>
                        {/* print */}
                        {/* <PenyuluhKecPrint
                            urlApi={`/penyuluh-kelompok-tani/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}`}
                            kecamatan={selectedKecamatan}
                        /> */}
                        {/* print */}
                    </div>
                    {/*  */}
                    <div className="wrap-filter flex justify-between items-center mt-4 ">
                        <div className="left gap-2 flex justify-start items-center">
                            <div className="w-auto">
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
                            <div className="fil-kect w-[185px]">
                                <KecamatanSelect
                                    value={selectedKecamatan}
                                    onChange={(value) => {
                                        setSelectedKecamatan(value); // Update state with selected value
                                    }}
                                />
                            </div>
                            <div className="filter-table w-[40px] h-[40px]">
                                {/* <FilterTable
                                    columns={columns}
                                    defaultCheckedKeys={getDefaultCheckedKeys()}
                                    onFilterChange={handleFilterChange}
                                /> */}
                            </div>
                        </div>
                        <div className="right transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            <Link href="/penyuluhan/data-poktan/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium w-full'>
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
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md ml-5 w-[280px]">
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
                                                <div className="fil-kect w-full mb-2">
                                                    <KecamatanSelect
                                                        value={selectedKecamatan}
                                                        onChange={(value) => {
                                                            setSelectedKecamatan(value); // Update state with selected value
                                                        }}
                                                    />
                                                </div>
                                            </>
                                            {/* Filter Kecamatan */}
                                            {/* filter tahun */}
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun" />
                                                <div className="w-full">
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
                                            </>
                                            {/* filter tahun */}

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

                                            {/* Filter Rentang Tanggal */}

                                            {/* Filter Tahun Bulan */}

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
                            {/* <PenyuluhKecPrint
                                urlApi={`/penyuluh-kelompok-tani/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}`}
                                kecamatan={selectedKecamatan}
                            /> */}
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">
                            <Link
                                href="/penyuluhan/data-poktan/tambah"
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

            {/* mobile table */}
            <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
                {dataPoktan?.data?.data && dataPoktan.data.data.length > 0 ? (
                    dataPoktan.data.data.map((item, index) => (
                        <div key={index} className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                            <div className="wrap-konten flex flex-col gap-2">
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">UPTD BPP</div>
                                    <div className="konten text-black/80 text-end">{item?.kecamatan.nama ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Desa</div>
                                    <div className="konten text-black/80 text-end">{item?.desa.nama ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Tahun</div>
                                    <div className="konten text-black/80 text-end">{item?.tahun ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">ID Poktan</div>
                                    <div className="konten text-black/80 text-end">{item?.idPoktan ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Nama Kelompok Tani</div>
                                    <div className="konten text-black/80 text-end">{item?.nama ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Ketua</div>
                                    <div className="konten text-black/80 text-end">{item?.ketua ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Sekretaris</div>
                                    <div className="konten text-black/80 text-end">{item?.sekretaris ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Bendahara</div>
                                    <div className="konten text-black/80 text-end">{item?.bendahara ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Alamat Sekretariat</div>
                                    <div className="konten text-black/80 text-end">{item?.alamat ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Tahun Dibentuk</div>
                                    <div className="konten text-black/80 text-end">{item?.dibent ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Jumlah Laki-laki</div>
                                    <div className="konten text-black/80 text-end">{item?.l ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Jumlah Perempuan</div>
                                    <div className="konten text-black/80 text-end">{item?.p ?? "-"}</div>
                                </div>
                                <div className="flex justify-between gap-5">
                                    <div className="label font-medium text-black">Kelas Kelompok</div>
                                    <div className="konten text-black/80 text-end">
                                        {
                                            item?.kelas === "p" ? "Pemula" :
                                                item?.kelas === "l" ? "Lanjut" :
                                                    item?.kelas === "m" ? "Madya" :
                                                        item?.kelas === "u" ? "Utama" :
                                                            "-"
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
                            <div className="flex gap-3 text-white">
                                <Link href={`/penyuluhan/data-poktan/detail/${item.id}`} className="bg-primary rounded-full w-full py-2 text-center">
                                    Detail
                                </Link>
                                <Link href={`/penyuluhan/data-poktan/edit/${item.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
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
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">No</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1 ">UPTD BPP</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1 ">Desa</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Kelompok Tani</TableHead>
                            <TableHead colSpan={3} className="text-primary border border-slate-200 text-center py-1">Pengurus Kelompok Tani</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1 ">Alamat Sekretariat</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1  ">Tahun dibentuk</TableHead>
                            <TableHead colSpan={2} className="text-primary border border-slate-200 text-center py-1  ">Jumlah Anggota</TableHead>
                            <TableHead colSpan={4} className="text-primary border border-slate-200 text-center py-1  ">Kelas Kelompok</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1  ">ID Poktan</TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Aksi</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">Ketua</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">Sekretaris</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">Bendahara</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">L</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">P</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">P</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">L</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">M</TableHead>
                            <TableHead className="text-primary border border-slate-200 text-center py-1 ">U</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataPoktan?.data?.data && dataPoktan?.data?.data?.length > 0 ? (
                            dataPoktan.data.data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="border border-slate-200 text-center">
                                        {(currentPage - 1) * limit + (index + 1)}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.kecamatan?.nama}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.desa.nama}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.nama}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.ketua}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.sekretaris}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.bendahara}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.alamat}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.dibent}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.l}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.p}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.kelas === "p" ? " ✓" : "-"}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.kelas === "l" ? " ✓" : "-"}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.kelas === "m" ? " ✓" : "-"}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.kelas === "u" ? " ✓" : "-"}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.idPoktan}
                                    </TableCell>
                                    <TableCell
                                        className="border border-slate-200 font-semibold"
                                    >
                                        <div className="flex items-center gap-4 justify-center">
                                            <Link
                                                className=""
                                                href={`/penyuluhan/data-poktan/detail/${item.id}`}
                                            >
                                                <EyeIcon />
                                            </Link>
                                            <Link
                                                className=""
                                                href={`/penyuluhan/data-poktan/edit/${item.id}`}
                                            >
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup
                                                onDelete={() =>
                                                    handleDelete(String(item.id) || "")
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={17} className='text-center'>
                                    <NotFoundSearch />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* table */}
            {/* pagination */}
            <div className="pagi flex items-center justify-center md:justify-end pb-5 lg:pb-0">
                {dataPoktan?.data?.pagination?.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataPoktan?.data?.pagination?.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default PenyuluhDataPoktan