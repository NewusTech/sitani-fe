"use client"
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import Swal from 'sweetalert2'
import useSWR, { mutate, SWRResponse } from 'swr'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import PaginationTable from '@/components/PaginationTable'
import KetahananPanganProdusenEceranPrint from '@/components/Print/KetahananPangan/Produsen-Dan-Eceran'
import FilterTable from '@/components/FilterTable'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// 
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface ListItem {
    id: number;
    kepangProdusenEceranId: number;
    kepangMasterKomoditasId: number;
    satuan: string | null;
    harga: number;
    keterangan: string;
    createdAt: string;
    updatedAt: string;
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    tanggal: string;
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

const KomponenHargaProdusenDanEceran = () => {
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

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataProdusenEceran }: SWRResponse<Response> = useSWR(
        `/kepang/produsen-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}`,
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
            await axiosPrivate.delete(`/kepang/produsen-eceran/delete/${id}`, {
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
            mutate('/kepang/produsen-eceran/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        }
    };

    // Filter table
    const columns = [
        { label: "No", key: "no" },
        { label: "Tanggal", key: "tanggal" },
        { label: "Komoditas", key: "komoditas" },
        { label: "Satuan", key: "satuan" },
        { label: "Harga Komoditasl", key: "hargaKomoditas" },
        { label: "Keterangan", key: "keterangan" },
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["no", "tanggal", "komoditas"];
            } else {
                return ["no", "tanggal", "komoditas", "satuan", "hargaKomoditas", "keterangan"];
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

    let num = 1;

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">

                {/* Dekstop */}
                <div className="hidden md:block">
                    <>
                        {/* header */}
                        <div className="header lg:flex lg:justify-between items-center">
                            <div className="search w-full lg:w-[50%] mb-2">
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left md:hidden">Daftar Harga <br /> Produsen dan Eceran</div>
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left hidden md:block">Daftar Harga Produsen dan Eceran</div>
                            </div>
                            {/* top */}
                            <div className="header flex gap-2 justify-between items-center mt-2 lg:mt-0 lg:w-[50%]">
                                <div className="search md:w-full">
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
                                <KetahananPanganProdusenEceranPrint
                                    urlApi={`/kepang/produsen-eceran/get?page=${currentPage}&search=${search}`}
                                />
                            </div>
                            {/* top */}
                        </div>
                        {/* print */}
                        {/* filter */}
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-center lg:justify-end items-center w-full mt-2">
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
                            {/* filter tanggal */}
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
                            {/* Filter table */}
                            <div className="">
                                <FilterTable
                                    columns={columns}
                                    defaultCheckedKeys={getDefaultCheckedKeys()}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                            {/* Filter table */}
                        </div>
                        {/* header */}
                    </>
                </div>
                {/* Dekstop */}

                {/* Mobile */}
                <div className="md:hidden">
                    <>
                        <div className="text-xl mb-4 font-semibold text-primary capitalize">Daftar Harga Produsen dan Eceran</div>
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
                                <KetahananPanganProdusenEceranPrint
                                    urlApi={`/kepang/produsen-eceran/get?page=${currentPage}&search=${search}`}
                                />
                                {/* print */}

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
                <Table className='border border-slate-200 mt-4 mb-20 lg:mb-0 text-xs md:text-sm rounded-lg'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow >
                            {visibleColumns.includes('no') && (
                                <TableHead className="text-primary py-3">No</TableHead>
                            )}
                            {visibleColumns.includes('tanggal') && (
                                <TableHead className="text-primary py-3">Tanggal</TableHead>
                            )}
                            {visibleColumns.includes('komoditas') && (
                                <TableHead className="text-primary py-3">Komoditas</TableHead>
                            )}
                            {visibleColumns.includes('satuan') && (
                                <TableHead className="text-primary py-3">Satuan</TableHead>
                            )}
                            {visibleColumns.includes('hargaKomoditas') && (
                                <TableHead className="text-primary py-3">Harga Komoditas</TableHead>
                            )}
                            {visibleColumns.includes('keterangan') && (
                                <TableHead className="text-primary py-3">Keterangan</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataProdusenEceran?.data?.data && dataProdusenEceran?.data?.data.length > 0 ? (
                            dataProdusenEceran.data.data.map((item, index) => (
                                item?.list?.map((citem, cindex) => (
                                    <TableRow key={citem.id}>
                                        {visibleColumns.includes('no') && (
                                            <TableCell>
                                                {num++}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('tanggal') && (
                                            <TableCell>
                                                {/* {item.tanggal} */}
                                                {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }) : 'Tanggal tidak tersedia'}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('komoditas') && (
                                            <TableCell>
                                                {citem?.komoditas.nama}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('satuan') && (
                                            <TableCell>
                                                {citem?.satuan}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('hargaKomoditas') && (
                                            <TableCell>
                                                {citem?.harga?.toLocaleString('id-ID')}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('keterangan') && (
                                            <TableCell>
                                                {citem?.keterangan}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* table */}

                {/* pagination */}
                <div className="pagi flex items-center lg:justify-end justify-center">
                    {dataProdusenEceran?.data.pagination.totalCount as number > 1 && (
                        <PaginationTable
                            currentPage={currentPage}
                            totalPages={dataProdusenEceran?.data.pagination.totalPages as number}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
                {/* pagination */}
            </div>
        </div>
    )
}

export default KomponenHargaProdusenDanEceran