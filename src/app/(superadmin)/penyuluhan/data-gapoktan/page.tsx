"use client";

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
import { CalendarDays, Calendar as CalendarIcon, CalendarSearch } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
// Filter di mobile

import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import HapusIcon from '../../../../../public/icons/HapusIcon'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DeletePopup from '@/components/superadmin/PopupDelete';
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable';
import BidangSelect from '@/components/superadmin/SelectComponent/BidangValue';
import FilterTable from '@/components/FilterTable';
import KepegawaianDataPegawaiPrint from '@/components/Print/Kepegawaian/DataPegawai';
import TambahIcon from '../../../../../public/icons/TambahIcon';
import TypingEffect from '@/components/ui/TypingEffect';
import NotFoundSearch from '@/components/SearchNotFound';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun';

interface Response {
    status: number;
    message: string;
    data: PenyuluhData;
}

interface PenyuluhData {
    data: PenyuluhGabunganKelompokTani[];
    pagination: Pagination;
}

interface PenyuluhGabunganKelompokTani {
    id: number;
    kecamatanId: number;
    desaId: number;
    tahun: number;
    nama: string;
    ketua: string;
    sekretaris: string;
    bendahara: string;
    alamat: string;
    lahan: number;
    dibentuk: number;
    poktan: number;
    l: number;
    p: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    kecamatan: Kecamatan;
    desa: Desa;
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

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    links: Links;
}

interface Links {
    prev: string | null;
    next: string | null;
}


const DataGapoktanViewAll = () => {
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

    // filter tahun dinamis
    const [selectedTahun, setSelectedTahun] = useState<string>(new Date().getFullYear().toString());
    // filter tahun dinamis

    const [selectedBidang, setSelectedBidang] = useState<string>("");

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataGapoktan }: SWRResponse<Response> = useSWR(
        `/penyuluh-gabungan-kelompok-tani/get?page=${currentPage}&year=${selectedTahun === 'semua' ? '' : selectedTahun}&search=${search}&tahun=${selectedTahun}&kecamatan=${selectedKecamatan}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res?.data)
    );

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/penyuluh-gabungan-kelompok-tani/delete/${id}`, {
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
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400',
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
        } mutate(`/penyuluh-gabungan-kelompok-tani/get?page=${currentPage}&year=${selectedTahun === 'semua' ? '' : selectedTahun}&search=${search}&tahun=${selectedTahun}&kecamatan=${selectedKecamatan}&limit=${limit}`);
    };

    const columns = [
        { label: "No", key: "no" },
        { label: "Nama UPTD BPP", key: "namaUPTD" },
        { label: "Nama Desa", key: "namaDesa" },
        { label: "Nama Gabungan Kelompok Tani", key: "namaGapoktan" },
        { label: "Pengurus Gabungan Kelompok Tani", key: "pengurusGapoktan" },
        { label: "Alamat Sekretaris", key: "alamatSekretaris" },
        { label: "Luas Lahan (Ha)", key: "luasLahan" },
        { label: "Tahun Dibentuk", key: "tahunDibentuk" },
        { label: "Jml Poktan", key: "jumlahPoktan" },
        { label: "Jml Anggota", key: "jumlahAnggota" },
        { label: "Total Anggota", key: "totalAnggota" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "namaUPTD", "namaDesa", "namaGapoktan", "pengurusGapoktan", "alamatSekretaris", "luasLahan", "tahunDibentuk", "jumlahPoktan", "jumlahAnggota", "totalAnggota", "aksi"];
            } else {
                return ["no", "namaUPTD", "namaDesa", "namaGapoktan", "pengurusGapoktan", "alamatSekretaris", "luasLahan", "tahunDibentuk", "jumlahPoktan", "jumlahAnggota", "totalAnggota", "aksi"];
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
        //   setVisibleColumns(getDefaultCheckedKeys());
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

    // gapoktan ada filter search, kecamatanm, desa, tahun

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary capitalize">Data Gapoktan</div>
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
                            {/* filter tahun */}
                            <TahunSelect
                                url='penyuluh/master-tahun/gabungan-kelompok-tani'
                                semua={true}
                                value={selectedTahun}
                                onChange={(value) => {
                                    setSelectedTahun(value);
                                }}
                            />
                            {/* filter tahun */}
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
                            <Link href="/penyuluhan/data-gapoktan/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium w-full'>
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
                                            <TahunSelect
                                                url='penyuluh/master-tahun/gabungan-kelompok-tani'
                                                semua={true}
                                                value={selectedTahun}
                                                onChange={(value) => {
                                                    setSelectedTahun(value);
                                                }}
                                            />
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

            {/* dekstop table*/}
            <div className="hidden md:block">
                <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden '>
                    <TableHeader className="bg-primary-600">
                        <TableRow >
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                No
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Nama UPTD BPP
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Nama Desa
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Nama Gabungan Kelompok Tani
                            </TableHead>
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                                Pengurus Gabungan Kelompok Tani
                            </TableHead>
                            <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                                Alamat Sekretaris
                            </TableHead>
                            <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                                Luas Lahan (Ha)
                            </TableHead>
                            <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                                Tahun Dibentuk
                            </TableHead>
                            <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                                Jml Poktan
                            </TableHead>
                            <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center ">
                                Jml Anggota
                            </TableHead>
                            <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                                Total Anggota
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Aksi</TableHead>
                        </TableRow>
                        <TableRow>
                            {visibleColumns.includes('pengurusGapoktan') && (
                                <TableHead className="text-primary py-1  border border-slate-200 text-center">
                                    Ketua
                                </TableHead>
                            )}
                            {visibleColumns.includes('pengurusGapoktan') && (
                                <TableHead className="text-primary py-1  border border-slate-200 text-center">
                                    Sekretaris
                                </TableHead>
                            )}
                            {visibleColumns.includes('pengurusGapoktan') && (
                                <TableHead className="text-primary py-1  border border-slate-200 text-center">
                                    Bendahara
                                </TableHead>
                            )}
                            {visibleColumns.includes('jumlahAnggota') && (
                                <TableHead className="text-primary py-1  border border-slate-200 text-center">
                                    L
                                </TableHead>
                            )}
                            {visibleColumns.includes('jumlahAnggota') && (
                                <TableHead className="text-primary py-1  border border-slate-200 text-center">
                                    P
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataGapoktan?.data?.data && dataGapoktan?.data?.data?.length > 0 ? (
                            dataGapoktan.data.data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="border border-slate-200 text-center">
                                        {(currentPage - 1) * limit + (index + 1)}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.kecamatan.nama}
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
                                        {item?.lahan}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.dibentuk}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.poktan}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.l}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.p}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {item?.total}
                                    </TableCell>
                                    <TableCell
                                        className="border border-slate-200 font-semibold"
                                    >
                                        <div className="flex items-center gap-4 justify-center">
                                            <Link
                                                className=""
                                                href={`/penyuluhan/data-gapoktan/detail/${item.id}`}
                                            >
                                                <EyeIcon />
                                            </Link>
                                            <Link
                                                className=""
                                                href={`/penyuluhan/data-gapoktan/edit/${item.id}`}
                                            >
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup
                                                onDelete={() =>
                                                    handleDelete(
                                                        String(item.id) ||
                                                        ""
                                                    )
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
            {/*Dekstop table */}

            {/* pagination */}
            <div className="pagi flex items-center justify-center md:justify-end pb-5 lg:pb-0">
                {dataGapoktan?.data?.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataGapoktan?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default DataGapoktanViewAll