"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
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
import EyeIcon from '../../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'

import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import PaginationTable from '@/components/PaginationTable'
import FilterTable from '@/components/FilterTable'
import KuisionerPedagangEceranPrint from '@/components/Print/KetahananPangan/Kuisioner-Pedagang-Eceran'
import "react-datepicker/dist/react-datepicker.css";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import TambahIcon from '../../../../../public/icons/TambahIcon'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface ListItem {
    id: number;
    kepangPedagangEceranId: number;
    kepangMasterKomoditasId: number;
    minggu1: number;
    minggu2: number;
    minggu3: number;
    minggu4: number;
    minggu5: number;
    createdAt: string;
    updatedAt: string;
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    mg1: string;
    createdAt: string;
    updatedAt: string;
    list: ListItem[];
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
        data: DataItem[];
        pagination: Pagination;
    };
}

const KuisionerPedagangEceran = () => {
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
    const [tahun, setTahun] = React.useState("Semua Tahun");
    // otomatis hitung tahun

    const { data: dataProdusenEceran }: SWRResponse<Response> = useSWR(
        `/kepang/pedagang-eceran/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    console.log(dataProdusenEceran)

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/kepang/pedagang-eceran/delete/${id}`, {
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
            mutate('/kepang/pedagang-eceran/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        }
    };

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Komoditas", key: "komoditas" },
        { label: "MG I", key: "mg1" },
        { label: "MG II", key: "mg2" },
        { label: "MG III", key: "mg3" },
        { label: "MG IV", key: "mg4" },
        { label: "MG V", key: "mg5" },
        { label: "Rata - Rata", key: "rataRata" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "komoditas", "rataRata", "aksi"];
            } else {
                return ["no", "komoditas", "mg1", "mg2", "mg3", "mg4", "mg5", "rataRata", "aksi"];
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
            <div className="text-2xl mb-4 font-semibold text-primary capitalize">Kuesioner Data Harian Panel Pedagangan Eceran</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center">
                        <div className="search md:w-[50%]">
                            <Input
                                type="text"
                                placeholder="Cari"
                                value={search}
                                onChange={handleSearchChange}
                                rightIcon={<SearchIcon />}
                                className='border-primary py-2'
                            />
                        </div>
                        {/* print */}
                        <KuisionerPedagangEceranPrint
                            urlApi={`/kepang/pedagang-eceran/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
                        />
                        {/* print */}
                    </div>
                    {/*  */}
                    <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-[70%]">
                            {/* filter tanggal */}
                            <>
                                <div className="w-auto">
                                    <Popover>
                                        <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                                {startDate ? format(startDate, "dd/MM/yyyy", { locale: id }) : <span>Tanggal Awal</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <DatePicker
                                                inline
                                                selected={startDate}
                                                onChange={(date: any) => setstartDate(date)}
                                                showYearDropdown
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                yearDropdownItemNumber={15}
                                                scrollableYearDropdown
                                                locale={id}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="">-</div>
                                <div className="w-auto">
                                    <Popover>
                                        <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                                {endDate ? format(endDate, "dd/MM/yyyy", { locale: id }) : <span>Tanggal Akhir</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <DatePicker
                                                inline
                                                selected={endDate}
                                                onChange={(date: any) => setendDate(date)}
                                                showYearDropdown
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                yearDropdownItemNumber={15}
                                                scrollableYearDropdown
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </>
                            {/* filter tahun */}
                            <div className="w-fit">
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
                            {/* filter tahun */}
                            {/* filter tanggal */}
                            <div className="w-[40px] h-[40px]">
                                <FilterTable
                                    columns={columns}
                                    defaultCheckedKeys={getDefaultCheckedKeys()}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="w-[30%] mt-4 lg:mt-0">
                            <div className="flex justify-end">
                                <Link href="/ketahanan-pangan/kuisioner-pedagang-eceran/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                                    Tambah Data
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* top */}
                </>
            </div>
            {/* Dekstop */}

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* kolom 1 */}
                    <div className="flex justify-between">
                        <div className="flex gap-2 w-full">

                            {/* filter tahun */}
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
                            {/* filter tahun */}

                            {/* filter table */}
                            <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            />
                            {/* filter table */}

                            {/* print */}
                            <KuisionerPedagangEceranPrint
                                urlApi={`/kepang/pedagang-eceran/get?page=${currentPage}&search=${search}&limit=${limit}&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
                            />
                            {/* print */}

                            {/* button tambah */}
                            <Link
                                href="/ketahanan-pangan/kuisioner-pedagang-eceran/tambah"
                                className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-center flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 w-fit'>
                                <TambahIcon />
                            </Link>
                            {/* button tambah */}

                        </div>
                    </div>
                    {/* kolom 1 */}

                    {/* kolom 2 */}
                    <div className="mt-2">
                        <div className="search w-full">
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
                    </div>
                    {/* kolom 2 */}

                    {/* kolom 3 */}
                    <div className="mt-2 flex gap-2 justify-between items-center">
                        <div className="w-full">
                            <Popover>
                                <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full flex items-center justify-between text-left font-normal text-[11px] lg:text-sm",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <span className='pl-2 text-xs'>
                                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: id }) : "Tanggal Awal"}
                                        </span>
                                        <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <DatePicker
                                        inline
                                        selected={startDate}
                                        onChange={(date: any) => setstartDate(date)}
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        locale={id}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="text-xs">to</div>
                        <div className="w-full">
                            <Popover>
                                <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full flex items-center justify-between text-left font-normal text-[11px] lg:text-sm",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <span className='pl-2 text-xs'>
                                            {endDate ? format(endDate, "dd/MM/yyyy", { locale: id }) : "Tanggal Awal"}
                                        </span>
                                        <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <DatePicker
                                        inline
                                        selected={endDate}
                                        onChange={(date: any) => setendDate(date)}
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        locale={id}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/* kolom 3 */}
                </>
            </div>
            {/* Mobile */}

            {/* table */}
            <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        {visibleColumns.includes('no') && (
                            <TableHead className="text-primary py-3">No</TableHead>
                        )}
                        {visibleColumns.includes('komoditas') && (
                            <TableHead className="text-primary py-3">Komoditas</TableHead>
                        )}
                        {visibleColumns.includes('mg1') && (
                            <TableHead className="text-primary py-3">MG I</TableHead>
                        )}
                        {visibleColumns.includes('mg2') && (
                            <TableHead className="text-primary py-3">MG II</TableHead>
                        )}
                        {visibleColumns.includes('mg3') && (
                            <TableHead className="text-primary py-3">MG III</TableHead>
                        )}
                        {visibleColumns.includes('mg4') && (
                            <TableHead className="text-primary py-3">MG IV</TableHead>
                        )}
                        {visibleColumns.includes('mg5') && (
                            <TableHead className="text-primary py-3">MG V</TableHead>
                        )}
                        {visibleColumns.includes('rataRata') && (
                            <TableHead className="text-primary py-3">Rata2 Per Bulan</TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead className="text-primary py-3">Aksi</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataProdusenEceran?.data?.data && dataProdusenEceran?.data?.data.length > 0 ? (
                        (() => {
                            let globalIndex = 1; // Inisialisasi global index
                            return dataProdusenEceran.data.data.map((item, index) => (
                                item?.list?.map((citem, cindex) => (
                                    <TableRow key={citem.id}>
                                        {visibleColumns.includes('no') && (
                                            <TableCell>
                                                {globalIndex++}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('komoditas') && (
                                            <TableCell>
                                                {citem?.komoditas.nama}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg1') && (
                                            <TableCell>
                                                {citem?.minggu1}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg2') && (
                                            <TableCell>
                                                {citem?.minggu2}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg3') && (
                                            <TableCell>
                                                {citem?.minggu3}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('mg4') && (
                                            <TableCell>
                                                {citem?.minggu4}
                                            </TableCell>)}
                                        {visibleColumns.includes('mg5') && (
                                            <TableCell>
                                                {citem?.minggu5}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('rataRata') && (
                                            <TableCell>
                                                {(citem?.minggu1 + citem?.minggu2 + citem?.minggu3 + citem?.minggu4 + citem?.minggu5) / 5}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('aksi') && (
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/ketahanan-pangan/kuisioner-pedagang-eceran/detail/${citem?.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                                    <Link href={`/ketahanan-pangan/kuisioner-pedagang-eceran/edit/${citem?.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <DeletePopup onDelete={() => handleDelete(String(citem?.id))} />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ));
                        })()
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataProdusenEceran?.data?.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataProdusenEceran?.data?.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default KuisionerPedagangEceran