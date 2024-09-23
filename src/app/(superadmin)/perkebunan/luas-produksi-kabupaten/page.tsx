"use client"

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

import React, { useEffect, useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
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
import DeletePopup from '@/components/superadmin/PopupDelete'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { SWRResponse } from 'swr'
import PerkebunanKabupatenPrint from '@/components/Print/Perkebunan/Kabupaten';

const LuasKabPage = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataProduksiKab }: SWRResponse<any> = useSWR(
        `/perkebunan/kabupaten/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "ngrok-skip-browser-warning": true
                    },
                })
                .then((res) => res.data)
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    return { status: 500, message: "Failed to fetch data", data: { yearBefore: 0, currentYear: 0, before: [], current: [] } };
                })
    );

    // if (error) return <div>Error loading data...</div>;
    if (!dataProduksiKab) return <div>Loading...</div>;

    // Filter table
    // const columns = [
    //     { label: "No", key: "no" },
    //     { label: "Komoditi", key: "komoditi" },
    //     { label: "Komposisi Luas Areal", key: "komposisi" },
    //     { label: "Jumlah", key: "jumlah" },
    //     { label: "Produksi (Ton)", key: "produksi" },
    //     { label: "Produktivitas Kg/Ha", key: "produktivitas" },
    //     { label: "Jml. Petani Pekebun (KK)", key: "jumlahPetani" },
    //     { label: "Bentuk Hasil	", key: "bentukHasil" },
    //     { label: "Keterangan", key: "keterangan" },
    //     { label: "Aksi", key: "aksi" },

    // ];

    // const getDefaultCheckedKeys = () => {
    //     if (typeof window !== 'undefined') {
    //         if (window.innerWidth <= 768) {
    //             return ["no", "komoditi", "aksi"];
    //         } else {
    //             return ["no", "komoditi", "komposisi", "jumlah", "produksi", "produktivitas", "jumlahPetani", "bentukHasil", "keterangan", "aksi"];
    //         }
    //     }
    //     return [];
    // };

    // const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    // const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     setIsClient(true);
    //     setVisibleColumns(getDefaultCheckedKeys());
    //     // const handleResize = () => {
    //     //     setVisibleColumns(getDefaultCheckedKeys());
    //     // };
    //     // window.addEventListener('resize', handleResize);
    //     // return () => window.removeEventListener('resize', handleResize);
    // }, []);

    // if (!isClient) {
    //     return null;
    // }

    // const handleFilterChange = (key: string, checked: boolean) => {
    //     setVisibleColumns(prev =>
    //         checked ? [...prev, key] : prev.filter(col => col !== key)
    //     );
    // };
    // Filter Table

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kabupaten )</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                            {/* filter kolom */}
                            {/* <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            /> */}
                            {/* filter kolom */}

                            <div className="w-fit">
                                {/* <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
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
                                </Select> */}
                            </div>
                            <div className="w-fit">
                                {/* <KecamatanSelect
                                    value={selectedKecamatan}
                                    onChange={(value) => {
                                        setSelectedKecamatan(value); // Update state with selected value
                                    }}
                                /> */}
                            </div>
                        </div>
                        <div className="btn flex gap-2">
                            <PerkebunanKabupatenPrint
                                urlApi={`/kepang/produsen-eceran/get`}
                            />
                        </div>
                    </div>
                    {/*  */}
                    {/* <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2">
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
                    </div> */}
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
                                    {/* <Button
                                        variant="outlinePrimary"
                                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                                    >
                                        <Filter className="text-primary w-5 h-5" />
                                    </Button> */}
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
                                                {/* <KecamatanSelect
                                                    value={selectedKecamatan}
                                                    onChange={(value) => {
                                                        setSelectedKecamatan(value); // Update state with selected value
                                                    }}
                                                /> */}
                                            </div>
                                            {/* Filter Kecamatan */}

                                            {/* Filter Desa */}
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
                            <PerkebunanKabupatenPrint
                                urlApi={`/kepang/produsen-eceran/get`}
                            />
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        <div className="flex justify-end items-center w-fit">

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

                </>
            </div>
            {/* Mobile */}

            {/* table */}
            <div className="">
                {/* Tabel Atap */}
                <Table className="border border-slate-200 mt-4 w-full">
                    <TableHeader className="bg-primary-600">
                        <TableRow>
                            <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                Atap {dataProduksiKab?.data?.yearBefore}
                            </TableHead>
                            <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                Atap {dataProduksiKab?.data?.currentYear}
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                No
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Komoditi
                            </TableHead>
                            <TableHead colSpan={3} className="text-primary text-center py-1 border border-slate-200">
                                Komposisi Luas Areal
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Jumlah
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Produksi (TON)
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Produktivitas Kg/Ha
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Jml. Petani Perkebun (KK)
                            </TableHead>
                            <TableHead colSpan={3} className="text-primary text-center py-1 border border-slate-200">
                                Komposisi Luas Areal
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Jumlah
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Produksi (TON)
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Produktivitas Kg/Ha
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                Jml. Petani Perkebun (KK)
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                TBM
                            </TableHead>
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                TM
                            </TableHead>
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                TR
                            </TableHead>
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                TBM
                            </TableHead>
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                TM
                            </TableHead>
                            <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                TR
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {/* TAHUNAN */}
                            <TableRow>
                                <TableCell className="border border-slate-200 font-semibold text-center">
                                    I
                                </TableCell>
                                <TableCell className="border border-slate-200 font-semibold">
                                    TAN. TAHUNAN
                                </TableCell>
                            </TableRow>
                            {/* komoditas */}
                            {dataProduksiKab?.data?.data[1]?.ids?.map((i: number, index: any) => (
                                <TableRow key={i}>
                                    <TableCell className="border border-slate-200 text-right">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-slate-200">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.komoditas}
                                    </TableCell>
                                    {/* ATAP */}
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapTbm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapTm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapTr}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapJumlah}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapProduksi}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapProduktivitas}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.atapJmlPetaniPekebun}
                                    </TableCell>
                                    {/* ASEM */}
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemTbm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemTm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemTr}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemJumlah}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemProduksi}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemProduktivitas}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[1]?.list[i]?.asemJmlPetaniPekebun}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* jumlah */}
                            < TableRow >
                                <TableCell className="border border-slate-200"></TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    JUMLAH I
                                </TableCell>
                                {/* ATAP */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data[1]?.atapSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.atapSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.atapSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.atapSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.atapSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.atapSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.atapSumJmlPetaniPekebun}
                                </TableCell>
                                {/* ASEM */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data[1]?.asemSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.asemSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.asemSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.asemSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.asemSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.asemSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[1]?.asemSumJmlPetaniPekebun}
                                </TableCell>
                            </TableRow>


                            {/* SEMSUSIM */}
                            <TableRow>
                                <TableCell className="border border-slate-200 font-semibold text-center">
                                    II
                                </TableCell>
                                <TableCell className="border border-slate-200 font-semibold">
                                    TAN. SEMUSIM
                                </TableCell>
                            </TableRow>
                            {/* komoditas */}
                            {dataProduksiKab?.data?.data[2]?.ids?.map((i: number, index: any) => (
                                <TableRow key={i}>
                                    <TableCell className="border border-slate-200 text-right">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-slate-200">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.komoditas}
                                    </TableCell>
                                    {/* ATAP */}
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapTbm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapTm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapTr}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapJumlah}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapProduksi}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapProduktivitas}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.atapJmlPetaniPekebun}
                                    </TableCell>
                                    {/* ASEM */}
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemTbm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemTm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemTr}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemJumlah}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemProduksi}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemProduktivitas}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[2]?.list[i]?.asemJmlPetaniPekebun}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* jumlah */}
                            <TableRow >
                                <TableCell className="border border-slate-200"></TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    JUMLAH II
                                </TableCell>
                                {/* ATAP */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data[2]?.atapSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.atapSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.atapSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.atapSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.atapSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.atapSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.atapSumJmlPetaniPekebun}
                                </TableCell>
                                {/* ASEM */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data[2]?.asemSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.asemSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.asemSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.asemSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.asemSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.asemSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[2]?.asemSumJmlPetaniPekebun}
                                </TableCell>
                            </TableRow>

                            {/* TAN. REMPAH DAN PENYEGAR */}
                            <TableRow>
                                <TableCell className="border border-slate-200 font-semibold text-center">
                                    III
                                </TableCell>
                                <TableCell className="border border-slate-200 font-semibold">
                                    TAN. REMPAH DAN PENYEGAR
                                </TableCell>
                            </TableRow>
                            {/* komoditas */}
                            {dataProduksiKab?.data?.data[3]?.ids?.map((i: number, index: any) => (
                                <TableRow key={i}>
                                    <TableCell className="border border-slate-200 text-right">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-slate-200">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.komoditas}
                                    </TableCell>
                                    {/* ATAP */}
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapTbm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapTm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapTr}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapJumlah}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapProduksi}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapProduktivitas}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.atapJmlPetaniPekebun}
                                    </TableCell>
                                    {/* ASEM */}
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemTbm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemTm}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemTr}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemJumlah}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemProduksi}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemProduktivitas}
                                    </TableCell>
                                    <TableCell className="border border-slate-200 text-center">
                                        {dataProduksiKab?.data?.data[3]?.list[i]?.asemJmlPetaniPekebun}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* jumlah */}
                            <TableRow >
                                <TableCell className="border border-slate-200"></TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    JUMLAH III
                                </TableCell>
                                {/* ATAP */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data[3]?.atapSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.atapSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.atapSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.atapSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.atapSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.atapSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.atapSumJmlPetaniPekebun}
                                </TableCell>
                                {/* ASEM */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data[3]?.asemSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.asemSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.asemSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.asemSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.asemSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.asemSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data[3]?.asemSumJmlPetaniPekebun}
                                </TableCell>
                            </TableRow>

                            {/* TOTAL JUMLAH SEMUA */}
                            <TableRow >
                                <TableCell className="border border-slate-200"></TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    TOTAL I + II + III
                                </TableCell>
                                {/* ATAP */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data?.atapSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.atapSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.atapSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.atapSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.atapSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.atapSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.atapSumJmlPetaniPekebun}
                                </TableCell>
                                {/* ASEM */}
                                <TableCell className="border font-semibold border-slate-200 text-center" >
                                    {dataProduksiKab?.data?.data?.asemSumTbm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.asemSumTm}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.asemSumTr}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.asemSumJumlah}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.asemSumProduksi}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.asemSumProduktivitas}
                                </TableCell>
                                <TableCell className="border font-semibold border-slate-200 text-center">
                                    {dataProduksiKab?.data?.data?.asemSumJmlPetaniPekebun}
                                </TableCell>
                            </TableRow>
                        </>
                    </TableBody>
                </Table>

                {/* Tabel Asem */}
                <div className="overflow-x-auto">
                    {/* <!-- Tabel Asem --> */}
                    {/* <Table className="border border-slate-200 mt-4 w-full">
                        <TableHeader className="bg-primary-600">
                            <TableRow>
                                <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                    {`Asem ${dataProduksiKab.data.currentYear}`}
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                    No
                                </TableHead>
                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                    Komoditi
                                </TableHead>
                                <TableHead colSpan={3} className="text-primary py-1 border border-slate-200">
                                    Komposisi Luas Areal
                                </TableHead>
                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                    Jumlah
                                </TableHead>
                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                    Produksi (TON)
                                </TableHead>
                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                    Produktivitas Kg/Ha
                                </TableHead>
                                <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                                    Jml. Petani Perkebun (KK)
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    TBM
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    TM
                                </TableHead>
                                <TableHead className="text-primary py-1 border border-slate-200 text-center">
                                    TR
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataProduksiKab.data.current.map((category, index) => (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="border border-slate-200 text-left">
                                            {toRoman(index + 1)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200 font-semibold">
                                            {category.kategori}
                                        </TableCell>
                                    </TableRow>
                                    {category.list.map((commodity, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="border border-slate-200 text-right">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell className="border border-slate-200">
                                                {commodity.komoditas}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.tbm}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.tm}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.tr}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.jumlah}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.produksi}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.produktivitas}
                                            </TableCell>
                                            <TableCell className="border border-slate-200 text-center">
                                                {commodity.jmlPetaniPekebun}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="border border-slate-200"></TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            Jumlah {category.kategori}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumTbm}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumTm}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumTr}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumJumlah}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumProduksi}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumProduktivitas}
                                        </TableCell>
                                        <TableCell className="border font-semibold border-slate-200 text-center">
                                            {category.sumJmlPetaniPekebun}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table> */}
                </div>
            </div >
            {/* table */}
        </div >
    )
}

export default LuasKabPage