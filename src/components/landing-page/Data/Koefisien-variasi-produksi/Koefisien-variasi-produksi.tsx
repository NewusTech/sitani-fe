"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
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
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { Input } from '@/components/ui/input'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import FilterTable from '@/components/FilterTable'
import KoefisienVariasiProduksiPrint from '@/components/Print/KetahananPangan/Koefisien-Variasi-Produksi/Index'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// GET LIST
interface Response {
    status: number;
    message: string;
    data: ProduksiData[];
}

interface ProduksiData {
    id: number;
    bulan: string; // ISO date string
    panen: number;
    gkpTkPetani: number;
    gkpTkPenggilingan: number;
    gkgTkPenggilingan: number;
    jpk: number;
    cabaiMerahKeriting: number;
    berasMedium: number;
    berasPremium: number;
    stokGkg: number;
    stokBeras: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

const KomponenKoefisienVariasiPrduksi = () => {
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
    const { data: dataProduksi }: SWRResponse<Response> = useSWR(
        `/kepang/cv-produksi/get?year=${tahun}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // Filter table
    const columns = [
        // { label: "No", key: "no" },
        // { label: "Bulan", key: "bulan" },
        { label: "Panen", key: "panen" },
        { label: "GKP Petani", key: "gkpPetani" },
        { label: "GKP Penggilingan", key: "gkpPenggilingan" },
        { label: "GKG Penggilingan", key: "gkgPenggilingan" },
        { label: "JPK", key: "jpk" },
        { label: "Cabai Merah Keriting", key: "cabaiMerahKeriting" },
        { label: "Beras Medium", key: "berasMedium" },
        { label: "Beras Premium", key: "berasPremium" },
        { label: "Stok GKG", key: "stokGKG" },
        { label: "Stok Beras", key: "stokBeras" },
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["panen", "gkpPetani"];
            } else {
                return ["panen", "gkpPetani", "gkpPenggilingan", "gkgPenggilingan", "jpk", "cabaiMerahKeriting", "berasMedium", "berasPremium", "stokGKG", "stokBeras"];
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
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">

                {/* Dekstop */}
                <div className="hidden md:block">
                    <>
                        {/* header */}
                        <div className="header lg:flex lg:justify-between items-center">
                            <div className="search w-full lg:w-[60%] mb-2">
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left md:hidden">Data Coefesien <br /> Variansi (CV) Tk. Produksi</div>
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left hidden md:block">Data Coefesien Variansi (CV) Tk. Produksi</div>
                            </div>
                            {/* top */}
                            <div className="header flex gap-6 justify-between items-center mt-2 lg:mt-0">
                                <div className="filter-table w-[40px] h-[40px]">
                                    <FilterTable
                                        columns={columns}
                                        defaultCheckedKeys={getDefaultCheckedKeys()}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-between lg:justify-start items-center w-full">
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
                                    <div className="div">
                                        {/* print */}
                                        <KoefisienVariasiProduksiPrint
                                            urlApi={`/kepang/cv-produksi/get?year=${tahun}`}
                                            tahun={tahun}
                                        />
                                        {/* print */}
                                    </div>
                                </div>
                            </div>
                            {/* top */}
                        </div>
                        {/* header */}
                    </>
                </div>
                {/* Dekstop */}

                {/* Mobile */}
                <div className="md:hidden">
                    <>
                        <div className="text-xl mb-4 font-semibold text-primary uppercase">Data Coefesien Variansi (CV) Tk. Produksi</div>
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
                                <KoefisienVariasiProduksiPrint
                                    urlApi={`/kepang/cv-produksi/get?year=${tahun}`}
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
                    <TableHeader className='bg-primary-600 rounded-lg'>
                        <TableRow >
                            {/* {visibleColumns.includes('no') && ( */}
                            <TableHead className="text-primary py-3">No</TableHead>
                            {/* )} */}
                            {/* {visibleColumns.includes('bulan') && ( */}
                            <TableHead className="text-primary py-3">Bulan</TableHead>
                            {/* )} */}
                            {visibleColumns.includes('panen') && (
                                <TableHead className="text-primary py-3">% Panen</TableHead>
                            )}
                            {visibleColumns.includes('gkpPetani') && (
                                <TableHead className="text-primary py-3">GKP Tk. Petani</TableHead>
                            )}
                            {visibleColumns.includes('gkpPenggilingan') && (
                                <TableHead className="text-primary py-3">GKP Tk. Penggilingan</TableHead>
                            )}
                            {visibleColumns.includes('gkgPenggilingan') && (
                                <TableHead className="text-primary py-3">GKG Tk. Penggilingan</TableHead>
                            )}
                            {visibleColumns.includes('jpk') && (
                                <TableHead className="text-primary py-3">JPK</TableHead>
                            )}
                            {visibleColumns.includes('cabaiMerahKeriting') && (
                                <TableHead className="text-primary py-3">Cabai Merah Keriting</TableHead>
                            )}
                            {visibleColumns.includes('berasMedium') && (
                                <TableHead className="text-primary py-3">Beras Medium</TableHead>
                            )}
                            {visibleColumns.includes('berasPremium') && (
                                <TableHead className="text-primary py-3">Beras Premium</TableHead>
                            )}
                            {visibleColumns.includes('stokGKG') && (
                                <TableHead className="text-primary py-3">Stok GKG</TableHead>
                            )}
                            {visibleColumns.includes('stokBeras') && (
                                <TableHead className="text-primary py-3">Stok Beras</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataProduksi?.data && dataProduksi?.data?.length > 0 ? (
                            dataProduksi?.data?.map((item, index) => (
                                <TableRow key={index}>
                                    {/* {visibleColumns.includes('no') && ( */}
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    {/* )} */}
                                    {/* {visibleColumns.includes('bulan') && ( */}
                                    <TableCell>
                                        {new Date(item.bulan).toLocaleDateString('id-ID', { month: 'long' })}
                                    </TableCell>
                                    {/* )} */}
                                    {visibleColumns.includes('panen') && (
                                        <TableCell>
                                            {item.panen}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('gkpPetani') && (
                                        <TableCell>
                                            {item.gkpTkPetani}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('gkpPenggilingan') && (
                                        <TableCell>
                                            {item.gkpTkPenggilingan}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('gkgPenggilingan') && (
                                        <TableCell>
                                            {item.gkgTkPenggilingan}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('jpk') && (
                                        <TableCell>
                                            {item.jpk}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('cabaiMerahKeriting') && (
                                        <TableCell>
                                            {item.cabaiMerahKeriting}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('berasMedium') && (
                                        <TableCell>
                                            {item.berasMedium}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('berasPremium') && (
                                        <TableCell>
                                            {item.berasPremium}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('stokGKG') && (
                                        <TableCell>
                                            {item.stokGkg}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('stokBeras') && (
                                        <TableCell>
                                            {item.stokBeras}
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
                    </TableBody>
                    <TableFooter className='bg-primary-600'>
                        <TableRow>
                            {/* {visibleColumns.includes('no') && ( */}
                            <TableCell className='text-primary py-3' colSpan={2}>Rata-rata</TableCell>
                            {/* )} */}
                            {visibleColumns.includes('panen') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPetani') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkgPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('jpk') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('cabaiMerahKeriting') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasMedium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasPremium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokGKG') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokBeras') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('aksi') && (
                                <TableCell className="text-primary py-3"></TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            {/* {visibleColumns.includes('no') && ( */}
                            <TableCell className='text-primary py-3' colSpan={2}>Maksimum</TableCell>
                            {/* )} */}
                            {visibleColumns.includes('panen') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPetani') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkgPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('jpk') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('cabaiMerahKeriting') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasMedium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasPremium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokGKG') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokBeras') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('aksi') && (
                                <TableCell className="text-primary py-3"></TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            {/* {visibleColumns.includes('no') && ( */}
                            <TableCell className='text-primary py-3' colSpan={2}>Minimum</TableCell>
                            {/* )} */}
                            {visibleColumns.includes('panen') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPetani') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkgPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('jpk') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('cabaiMerahKeriting') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasMedium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasPremium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokGKG') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokBeras') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('aksi') && (
                                <TableCell className="text-primary py-3"></TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            {/* {visibleColumns.includes('no') && ( */}
                            <TableCell className='text-primary py-3' colSpan={2}>Target CV</TableCell>
                            {/* )} */}
                            {visibleColumns.includes('panen') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPetani') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkgPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('jpk') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('cabaiMerahKeriting') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasMedium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasPremium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokGKG') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokBeras') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('aksi') && (
                                <TableCell className="text-primary py-3"></TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            {/* {visibleColumns.includes('no') && ( */}
                            <TableCell className='text-primary py-3' colSpan={2}>CV (%)</TableCell>
                            {/* )} */}
                            {visibleColumns.includes('panen') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPetani') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkpPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('gkgPenggilingan') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('jpk') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('cabaiMerahKeriting') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasMedium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('berasPremium') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokGKG') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('stokBeras') && (
                                <TableCell className="text-primary py-3">5370</TableCell>
                            )}
                            {visibleColumns.includes('aksi') && (
                                <TableCell className="text-primary py-3"></TableCell>
                            )}
                        </TableRow>
                    </TableFooter>
                </Table>
                {/* table */}
            </div>
        </div >
    )
}

export default KomponenKoefisienVariasiPrduksi