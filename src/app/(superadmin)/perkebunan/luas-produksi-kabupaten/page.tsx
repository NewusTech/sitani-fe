"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
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

import { format } from "date-fns"
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

interface ResponseData {
    status: number;
    message: string;
    data: {
        yearBefore: number;
        currentYear: number;
        before: CategoryData[];
        current: CategoryData[];
    };
}

interface CategoryData {
    kategori: string;
    sumJumlah: number;
    sumTbm: number;
    sumTm: number;
    sumTr: number;
    sumJmlPetaniPekebun: number;
    sumProduktivitas: number;
    sumProduksi: number;
    list: Commodity[];
}

interface Commodity {
    id: number;
    komoditas: string;
    tbm: number;
    tm: number;
    tr: number;
    jumlah: number;
    produksi: number;
    produktivitas: number;
    jmlPetaniPekebun: number;
    bentukHasil: string;
    keterangan: string;
}

const LuasKabPage = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataProduksiKab }: SWRResponse<ResponseData> = useSWR(
        `/perkebunan/kabupaten/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    const toRoman = (num: number) => {
        const romanNumerals = [
            { value: 1000, symbol: 'M' },
            { value: 900, symbol: 'CM' },
            { value: 500, symbol: 'D' },
            { value: 400, symbol: 'CD' },
            { value: 100, symbol: 'C' },
            { value: 90, symbol: 'XC' },
            { value: 50, symbol: 'L' },
            { value: 40, symbol: 'XL' },
            { value: 10, symbol: 'X' },
            { value: 9, symbol: 'IX' },
            { value: 5, symbol: 'V' },
            { value: 4, symbol: 'IV' },
            { value: 1, symbol: 'I' },
        ];

        let result = '';
        for (let i = 0; i < romanNumerals.length; i++) {
            while (num >= romanNumerals[i].value) {
                result += romanNumerals[i].symbol;
                num -= romanNumerals[i].value;
            }
        }
        return result;
    };

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kabupaten )</div>
            {/* title */}

            {/* top */}
            <div className="header flex gap-2 justify-between items-center mt-4">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block">
                            Print
                        </div>
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
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
                                    {startDate ? format(startDate, "PPP") : <span>Tanggal Awal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar className=''
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setstartDate}
                                    initialFocus
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
                                    {endDate ? format(endDate, "PPP") : <span>Tanggal Akhir</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setendDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <div className="w-full">
                        <Select >
                            <SelectTrigger>
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Link href="/perkebunan/luas-produksi-kabupaten/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <div className="flex space-x-0">
                {/* Tabel Atap */}
                <Table className="border border-slate-200 mt-4 w-full">
                    <TableHeader className="bg-primary-600">
                        <TableRow>
                            <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                                {`Atap ${dataProduksiKab.data.yearBefore}`}
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
                        {dataProduksiKab.data.before.map((category, index) => (
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
                </Table>

                {/* Tabel Asem */}
                <div className="overflow-x-auto">
                    {/* <!-- Tabel Asem --> */}
                    <Table className="border border-slate-200 mt-4 w-full">
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
                    </Table>
                </div>
            </div>
            {/* table */}
        </div>
    )
}

export default LuasKabPage