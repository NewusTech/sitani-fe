"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
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
import DeletePopup from '@/components/superadmin/PopupDelete'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'

const KorlubTanamanHias = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()


    // INTEGRASI
    interface KorluhTanamanHiasResponse {
        status: number;
        message: string;
        data: {
            data: KorluhTanamanHias[];
            pagination: Pagination;
        };
    }

    interface KorluhTanamanHias {
        id: number;
        kecamatanId: number;
        desaId: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
        list: Tanaman[];
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

    interface Tanaman {
        id: number;
        korluhTanamanHiasId: number;
        namaTanaman: string;
        satuanProduksi: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        rerataHarga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
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
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // GETALL
    const { data: dataTanaman }: SWRResponse<KorluhTanamanHiasResponse> = useSWR(
        // `korluh/padi/get?limit=1`,
        `korluh/tanaman-hias/get?limit=10`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log(dataTanaman)

    // INTEGRASI

    // DELETE
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: string) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.delete(`/korluh/tanaman-hias/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id)
            // Update the local data after successful deletion
            mutate('/korluh/tanaman-hias/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/korluh/tanaman-hias/get`);
    };
    // DELETE

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">BPP Kecamatan Tanaman Hias</div>
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
                    <Link href="/bpp-kecamatan/tanaman-hias/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="text-center items-center">
                                Nama Tanaman
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Tanaman Akhir Triwulan Yang Lalu (m2)
                            </div>
                        </TableHead>
                        <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            <div className="text-center items-center">
                                Luas Panen (m2)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Rusak / Tidak Berhasil / Puso (m2)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Penanaman Baru / Tambah Tanam (m2)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Luas Tanaman Akhir Triwulan Laporan (m2)  (3)-(4)-(6)+(7)
                            </div>
                        </TableHead>
                        <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produksi
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Satuan Produksi
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            <div className="w-[150px] text-center items-center">
                                Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)
                            </div>
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Keterangan
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Habis / <br /> Dibongkar
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Belum Habis
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Dipanen Habis / Dibongkar
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Belum Habis
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataTanaman?.data.data.map((item, index) => (
                        item.list.map((tanaman) => (
                            <TableRow key={tanaman.id}>
                                <TableCell className='border border-slate-200 text-center'>
                                    {index + 1}
                                </TableCell>
                                <TableCell className='border border-slate-200'>
                                    {tanaman.namaTanaman}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    belum ada
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.luasPanenHabis} hd
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.luasPanenBelumHabis}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.luasRusak}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.luasPenanamanBaru}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    belum ada
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.produksiHabis}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.produksiBelumHabis}
                                </TableCell>
                                <TableCell className='border border-slate-200'>
                                    {tanaman.satuanProduksi}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.rerataHarga}
                                </TableCell>
                                <TableCell className='border border-slate-200 text-center'>
                                    {tanaman.keterangan}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Link className='' href={`/bpp-kecamatan/tanaman-hias/${tanaman.id}`}>
                                            <EyeIcon />
                                        </Link>
                                        <Link className='' href={`/bpp-kecamatan/tanaman-hias/edit/${tanaman.id}`}>
                                            <EditIcon />
                                        </Link>
                                        <DeletePopup onDelete={() => handleDelete(tanaman.id?.toString() || '')} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ))}
                    <TableRow>
                        <TableCell className='border border-slate-200'>
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            Jumlah
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            belum
                        </TableCell>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagination md:mb-[0px] mb-[110px] flex md:justify-end justify-center">
                <Pagination className='md:justify-end'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            {/* pagination */}
        </div>
    )
}

export default KorlubTanamanHias