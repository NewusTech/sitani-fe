"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState, useRef } from 'react'
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
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import UnduhIcon from '../../../../../public/icons/UnduhIcon';
import PrintIcon from '../../../../../public/icons/PrintIcon';
// 
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




const PenyuluhKabPrint = () => {

    // INTEGRASI
    // GET LIST
    interface Kecamatan {
        id: string;
        nama: string
    }
    interface User {
        id?: string; // Ensure id is a string
        nama: string;
        nip: string;
        pangkat: string;
        golongan: string;
        keterangan: string;
        kecamatan: Kecamatan[];
    }

    interface Response {
        status: string,
        data: {
            data: User[];
            pagination: Pagination;
        },
        message: string
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
    const { data: dataKabupaten }: SWRResponse<Response> = useSWR(
        `/penyuluh-kabupaten/get?page=${currentPage}&search=${search}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET LIST

    //PRINT
    // print
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    // download PDF
    const handleDownloadPDF = async () => {
        if (printRef.current) {
            const canvas = await html2canvas(printRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4',
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('laporan.pdf');
        }
    };
    //PRINT 
    const currentYear = new Date().getFullYear();

    return (
        <div className="">
            <div className="btn flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button onClick={handleDownloadPDF} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            <UnduhIcon />
                            <div className="hidden md:block">
                                Download
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Pilih Unduhan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleDownloadPDF}>
                                Unduh PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrint}>
                                Unduh Excel
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handlePrint} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    <PrintIcon />
                    <div className="hidden md:block">
                        Print
                    </div>
                </Button>
            </div>
            {/* KONTEN PRINT */}
            <div className="absolute w-full left-[99999px]">
                <div ref={printRef} className='p-[50px]'>
                    <div className="ata mb-4 text-base flex justify-end">
                        <div className="wr w-[300px] flex gap-1">
                            <div className="">
                                <div className="">Lampiran</div>
                                <div className="">Nomor</div>
                                <div className="">Tanggal</div>
                            </div>
                            <div className="">
                                <div className="">:</div>
                                <div className="">:</div>
                                <div className="">:</div>
                            </div>
                        </div>
                    </div>
                    {/* title */}
                    <div className="text-xl mb-4 font-semibold text-black mx-auto uppercase flex justify-center">
                        Daftar Penempatan Penyuluh Pertanian Kabupaten Lampung Timur Tahun {currentYear}
                    </div>
                    {/* title */}
                    <div className="uppercase">Kabupaten</div>
                    {/* table */}
                    <Table className='border border-black mt-1'>
                        <TableHeader className='bg-white text-black'>
                            <TableRow >
                                <TableHead className="border border-black text-black py-3 uppercase text-center font-semibold">No</TableHead>
                                <TableHead className="border border-black text-black py-3 uppercase text-center font-semibold">Nama</TableHead>
                                <TableHead className="border border-black text-black py-3 uppercase text-center font-semibold">NIP</TableHead>
                                <TableHead className="border border-black text-black py-3 uppercase text-center font-semibold ">
                                    Pangkat/Gol
                                </TableHead>
                                <TableHead className="border border-black text-black py-3 uppercase text-center font-semibold ">Wilayah Desa Binaan</TableHead>
                                <TableHead className="border border-black text-black py-3 uppercase text-center font-semibold ">Keterangan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow >
                                <TableCell className="border border-black p-2 text-black  text-center">1</TableCell>
                                <TableCell className="border border-black p-2 text-black  text-center">2</TableCell>
                                <TableCell className="border border-black p-2 text-black  text-center">3</TableCell>
                                <TableCell className="border border-black p-2 text-black  text-center ">
                                    4
                                </TableCell>
                                <TableCell className="border border-black p-2 text-black  text-center ">5</TableCell>
                                <TableCell className="border border-black p-2 text-black  text-center ">6</TableCell>
                            </TableRow>
                            {dataKabupaten?.data?.data && dataKabupaten?.data?.data?.length > 0 ? (
                                dataKabupaten?.data?.data?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='border border-black p-2 text-black text-center'>
                                            {(currentPage - 1) * limit + (index + 1)}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black '>
                                            {item.nama}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black '>
                                            {item.nip}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black '>
                                            {item.pangkat}, {item.golongan}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black'>
                                            {item.kecamatan.map((kec, index) => (
                                                <span key={kec.id}>
                                                    {kec.nama}
                                                    {index < item.kecamatan.length - 1 && ", "}
                                                </span>
                                            ))}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black '>
                                            {item.keterangan}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        Tidak ada data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default PenyuluhKabPrint