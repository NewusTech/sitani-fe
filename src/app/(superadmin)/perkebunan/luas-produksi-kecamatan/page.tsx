"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable'


const LuasKecPage = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    // limit
    const [limit, setLimit] = useState(1);
    // limit
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination

    const { data: dataProduksi }: SWRResponse<any> = useSWR(
        `/perkebunan/kecamatan/get?page=${currentPage}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "ngrok-skip-browser-warning" : true,
                    },
                })
                .then((res: any) => {
                    return res.data;
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    return { status: "error", message: "Failed to fetch data" };
                })
        // .then((res: any) => res.data)
    );

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/perkebunan/kecamatan/delete/${id}`, {
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
        } mutate(`/perkebunan/kecamatan/get?page=${currentPage}&limit=${limit}`);
    };


    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kecamatan )</div>
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
                    <Link href="/perkebunan/luas-produksi-kecamatan/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* keterangan */}
            <div className="keterangan flex gap-2 mt-3">
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
            {/* keterangan */}

            {/* table */}
            <Table className='border border-slate-200 mt-2'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Komoditi
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Komposisi Luas Areal
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Jumlah
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produksi (Ton)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas Kg/Ha
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Jml. Petani Pekebun (KK)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Bentuk Hasil
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Keterangan
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 text-center">
                            Aksi
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
                    {dataProduksi?.data?.data && dataProduksi?.data?.data?.length > 0 ? (
                        dataProduksi?.data?.data.map((item: any) => (
                            <>
                                {/* Tahunan */}
                                < TableRow >
                                    <TableCell className='border border-slate-200 font-semibold text-center'>
                                        I
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>
                                        TAN. TAHUNAN
                                    </TableCell>
                                    <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                </TableRow>
                                {/* komoditas */}
                                {item?.list[1]?.masterIds?.map((i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                        <TableCell className='border border-slate-200'>
                                            {/* Aren */}
                                            {item?.list[1]?.list[i]?.komoditas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.tbm}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.tm}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.tr}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.jumlah}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.produksi}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.produktivitas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.jmlPetaniPekebun}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.bentukHasil}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[1]?.list[i]?.keterangan}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${item?.list[1]?.list[i]?.id}`}>
                                                    <EyeIcon />
                                                </Link>
                                                <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${item?.list[1]?.list[i]?.id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <DeletePopup onDelete={() => handleDelete(String(item?.list[1]?.list[i]?.id))} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* jumlah I */}
                                <TableRow >
                                    <TableCell className='border border-slate-200 text-center'></TableCell>
                                    <TableCell className='border italic font-semibold border-slate-200'>
                                        Jumlah I
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumTbm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumTm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumTr}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumJumlah}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumProduksi}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumProduktivitas}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[1]?.sumJmlPetaniPekebun}
                                    </TableCell>
                                    <TableCell className='border border-slate-200' colSpan={2} />
                                </TableRow>
                                {/* Tahunan */}

                                {/* Semusim */}
                                <TableRow>
                                    <TableCell className='border font-semibold border-slate-200 text-center'>
                                        II
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>
                                        TAN. SEMUSIM
                                    </TableCell>
                                    <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                </TableRow>
                                {/* Komoditas */}
                                {item?.list[2]?.masterIds?.map((i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                        <TableCell className='border border-slate-200'>
                                            {/* Aren */}
                                            {item?.list[2]?.list[i]?.komoditas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.tbm}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.tm}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.tr}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.jumlah}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.produksi}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.produktivitas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.jmlPetaniPekebun}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.bentukHasil}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[2]?.list[i]?.keterangan}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${item?.list[2]?.list[i]?.id}`}>
                                                    <EyeIcon />
                                                </Link>
                                                <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${item?.list[2]?.list[i]?.id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <DeletePopup onDelete={() => handleDelete(String(item?.list[2]?.list[i]?.id))} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* jumlah II */}
                                <TableRow >
                                    <TableCell className='border border-slate-200 text-center'></TableCell>
                                    <TableCell className='border italic font-semibold border-slate-200'>
                                        Jumlah II
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumTbm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumTm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumTr}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumJumlah}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumProduksi}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumProduktivitas}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[2]?.sumJmlPetaniPekebun}
                                    </TableCell>
                                    <TableCell className='border border-slate-200' colSpan={2} />
                                </TableRow>
                                {/* Semusim */}

                                {/* Rempah */}
                                <TableRow>
                                    <TableCell className='border font-semibold border-slate-200 text-center'>
                                        III
                                    </TableCell>
                                    <TableCell className='border border-slate-200 font-semibold'>TAN. REMPAH DAN PENYEGAR</TableCell>
                                    <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                </TableRow>
                                {/* Komoditas */}
                                {item?.list[3]?.masterIds?.map((i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                        <TableCell className='border border-slate-200'>
                                            {/* Aren */}
                                            {item?.list[3]?.list[i]?.komoditas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.tbm}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.tm}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.tr}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.jumlah}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.produksi}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.produktivitas}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.jmlPetaniPekebun}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.bentukHasil}
                                        </TableCell>
                                        <TableCell className='border border-slate-200 text-center'>
                                            {item?.list[3]?.list[i]?.keterangan}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${item?.list[3]?.list[i]?.id}`}>
                                                    <EyeIcon />
                                                </Link>
                                                <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${item?.list[3]?.list[i]?.id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <DeletePopup onDelete={() => handleDelete(String(item?.list[3]?.list[i]?.id))} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* jumlah III */}
                                <TableRow >
                                    <TableCell className='border border-slate-200 text-center'></TableCell>
                                    <TableCell className='border italic font-semibold border-slate-200'>
                                        Jumlah III
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumTbm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumTm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumTr}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumJumlah}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumProduksi}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumProduktivitas}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list[3]?.sumJmlPetaniPekebun}
                                    </TableCell>
                                    <TableCell className='border border-slate-200' colSpan={2} />
                                </TableRow>
                                {/* Rempah */}

                                {/* jumlah semua */}
                                <TableRow >
                                    <TableCell className='border border-slate-200 text-center'></TableCell>
                                    <TableCell className='border italic font-semibold border-slate-200'>
                                    TOTAL I + II + III
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumTbm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumTm}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumTr}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumJumlah}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumProduksi}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumProduktivitas}
                                    </TableCell>
                                    <TableCell className='border text-center border-slate-200'>
                                        {item?.list?.sumJmlPetaniPekebun}
                                    </TableCell>
                                    <TableCell className='border border-slate-200' colSpan={2} />
                                </TableRow>
                            </>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table >
            {/* table */}
            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataProduksi?.data?.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataProduksi?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div >
    )
}

export default LuasKecPage