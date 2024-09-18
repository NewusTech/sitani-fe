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
    // Tahun
    const [tahun, setTahun] = React.useState("2024");
    // tahun

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
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header lg:flex lg:justify-between items-center">
                    <div className="search w-full lg:w-[70%]">
                        <div className="text-primary font-semibold text-lg lg:text-3xl flex-shrink-0">Data Coefesien Variansi (CV) Tk. Produksi</div>
                    </div>
                    {/* top */}
                    <div className="header flex gap-6 justify-between items-center mt-4">
                        <div className="filter-table w-[40px] h-[40px]">
                            <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                        {/* print */}
                        <KoefisienVariasiProduksiPrint
                            urlApi={`/kepang/cv-produksi/get?year=${tahun}`}
                            tahun={tahun}
                        />
                        {/* print */}
                    </div>
                    {/* top */}
                </div>
                {/* header */}

                {/* table */}
                <Table className='border border-slate-200 mt-4'>
                    <TableHeader className='bg-primary-600'>
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
                                            belum ada
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
        </div>
    )
}

export default KomponenKoefisienVariasiPrduksi