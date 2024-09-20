"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'
import { id } from 'date-fns/locale';
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
import { format } from "date-fns"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import KoefisienVariasiProdusenPrint from '@/components/Print/KetahananPangan/Koefisien-Variasi-Produsen'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
}

interface ListItem {
    id: number;
    kepangCvProdusenId: number;
    kepangMasterKomoditasId: number;
    nilai: number;
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    bulan: string; // ISO 8601 format date-time
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
    list: ListItem[];
}

interface Response {
    status: number;
    message: string;
    data: DataItem[];
}

const KomponenKoefisienVariasiProdusen = () => {
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

    const { data, error } = useSWR<Response>(
        `/kepang/cv-produsen/get?year=${tahun}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;

    const allKomoditas = new Set<string>();
    data.data.forEach((item) => {
        item.list.forEach((komoditas) => {
            allKomoditas.add(komoditas.komoditas.nama);
        });
    });
    const uniqueKomoditas = Array.from(allKomoditas);

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* Dekstop */}
                <div className="hidden md:block">
                    <>
                        {/* header */}
                        <div className="header lg:flex lg:justify-between items-center">
                            <div className="search w-full lg:w-[70%]">
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left md:hidden">Data Coefesien <br /> Variansi (CV) Tk. Produsen</div>
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left hidden md:block">Data Coefesien Variansi (CV) Tk. Produsen</div>
                            </div>
                            {/* top */}
                            <div className="header flex gap-2 justify-between items-center mt-4">
                                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
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
                                </div>
                                {/* print */}
                                <KoefisienVariasiProdusenPrint
                                    urlApi={`/kepang/cv-produsen/get?year=${tahun}`}
                                    tahun={tahun}
                                />
                                {/* print */}
                            </div>
                            {/* top */}
                        </div>
                        {/* header */}
                    </>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <>
                        <div className="text-xl mb-4 font-semibold text-primary capitalize">Data Coefesien Variansi (CV) Tk. Produsen</div>
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
                                {/* <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            /> */}
                                {/* filter table */}

                                {/* print */}
                                <KoefisienVariasiProdusenPrint
                                    urlApi={`/kepang/cv-produsen/get?year=${tahun}`}
                                    tahun={tahun}
                                />
                                {/* print */}
                            </div>
                        </div>
                        {/* kolom 1 */}
                    </>
                </div>
                {/* Mobile */}

                {/* table */}
                <Table className='border border-slate-200 mt-4 mb-20 lg:mb-0 text-xs md:text-sm rounded-lg'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow>
                            <TableHead className="text-primary py-3">No</TableHead>
                            <TableHead className="text-primary py-3">Bulan</TableHead>
                            {uniqueKomoditas.map((komoditas) => (
                                <TableHead key={komoditas} className="text-primary py-3">{komoditas}</TableHead>
                            ))}
                            {/* <TableHead className="text-primary py-3">Aksi</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length > 0 ? (
                            data.data.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{format(new Date(item.bulan), 'MMMM', { locale: id })}</TableCell>
                                    {uniqueKomoditas.map((komoditas) => {
                                        const foundCommodity = item.list.find(k => k.komoditas.nama === komoditas);
                                        return (
                                            <TableCell key={komoditas}>
                                                {foundCommodity ? (
                                                    <div className="flex items-center gap-4">
                                                        <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                                                            {new Intl.NumberFormat('id-ID').format(foundCommodity.nilai)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={15} className="text-center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {/* <TableFooter className='bg-primary-600'>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Rata-rata</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Maksimum</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Minimum</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Target CV</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>CV (%)</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                </TableFooter> */}
                </Table>
                {/* table */}
            </div>
        </div>
    )
}

export default KomponenKoefisienVariasiProdusen