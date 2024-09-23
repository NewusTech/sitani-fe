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
import Swal from 'sweetalert2';

interface PrintProps {
    urlApi?: string;
    kecamatan?: string;
    tahun?: string;
}

const PerkebunanKecamatanPrint = (props: PrintProps) => {

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
        `/perkebunan/kabupaten/get?page=${currentPage}&search=${search}&limit=${limit}`,
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
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/perkebunan-kecamatan`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.ms-excel',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'Perkebunan Kecamatan.xlsx'); // Nama file yang diunduh
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link); // Hapus elemen setelah di-click
            Swal.fire({
                icon: "success",
                title: "Berhasil download",
                timer: 2000,
                showConfirmButton: false,
                position: "center",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal download!",
                timer: 2000,
                showConfirmButton: false,
                position: "center",
            });
            console.error('Error downloading the file:', error);
        }
    };

    // download PDF
    const handleDownloadPDF = async () => {
        try {
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
                pdf.save('Penyuluhan Kabupaten.pdf');

                // Notifikasi Swal sukses
                Swal.fire({
                    icon: "success",
                    title: "Berhasil download",
                    timer: 2000,
                    showConfirmButton: false,
                    position: "center",
                });
            }
        } catch (error) {
            // Notifikasi Swal error
            Swal.fire({
                icon: "error",
                title: "Gagal download!",
                timer: 2000,
                showConfirmButton: false,
                position: "center",
            });
            console.error('Error downloading the PDF:', error);
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
                        <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                            Pilih Unduhan
                        </DropdownMenuLabel>
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {/* <DropdownMenuItem onClick={handleDownloadPDF}>
                                Unduh PDF
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={handleDownloadExcel}>
                                Unduh Excel
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* <Button onClick={handlePrint} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    <PrintIcon />
                    <div className="hidden md:block">
                        Print
                    </div>
                </Button> */}
            </div>
            {/* KONTEN PRINT */}
            <div className="absolute -left-[700%] min-w-[39.7cm] w-full">
                {/* <div className=""> */}
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
                    
                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default PerkebunanKecamatanPrint