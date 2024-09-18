// /* eslint-disable react-hooks/rules-of-hooks */
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
import Link from 'next/link'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import { Badge } from '@/components/ui/badge'
import { format } from "date-fns"

interface PrintProps {
    urlApi?: string;
    tahun?: string;
    kecamatan?: string;
}

const KoefisienVariasiProdusenPrint = (props: PrintProps) => {
    // INTEGRASI
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
    //   
    // GET LIST integrasi
    const [tahun, setTahun] = React.useState("2024");
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
    
    // print
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });
    // print

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;

    const allKomoditas = new Set<string>();
    data.data.forEach((item) => {
        item.list.forEach((komoditas) => {
            allKomoditas.add(komoditas.komoditas.nama);
        });
    });
    const uniqueKomoditas = Array.from(allKomoditas);

    // download Excel
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/kepang-cv-produsen?year==${props.tahun}`;
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
            link.setAttribute('download', `Data Coefesien Variansi (CV) Tk. Produsen
.xlsx`); // Nama file yang diunduh
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
                pdf.save(`Data Perbandingan Harga Komoditas Kabupaten Lampung Timur.pdf`);

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
                        <DropdownMenuLabel>Pilih Unduhan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleDownloadPDF}>
                                Unduh PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadExcel}>
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
            <div className="absolute -left-[700%] min-w-[39.7cm] w-full">
                {/* <div className=""> */}
                <div ref={printRef} className='p-[50px]'>
                    {/* title */}
                    <div className="text-xl mb-4 font-semibold text-black mx-auto capitalize flex justify-center text-center">
                        Data Coefesien Variansi (CV) Tk. Produsen <br />
                        Kabupaten Lampung Timur Tahun {props.tahun || currentYear}
                    </div>
                    {/* title */}

                    {/* table */}
                    <Table className='border border-black p-2 mt-1'>
                        <TableHeader className='bg-white text-black'>
                            <TableRow>
                                <TableHead className="border border-black p-2 text-black text-center font-semibold">No</TableHead>
                                <TableHead className="border border-black p-2 text-black text-center font-semibold">Bulan</TableHead>
                                {uniqueKomoditas.map((komoditas) => (
                                    <TableHead key={komoditas} className="border border-black p-2 text-black text-center font-semibold">{komoditas}</TableHead>
                                ))}
                                {/* <TableHead className="border border-black p-2 text-black text-center font-semibold">Aksi</TableHead> */}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.data.length > 0 ? (
                                data.data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className='border border-black p-2 text-black text-center'>{index + 1}</TableCell>
                                        <TableCell className='border border-black p-2 text-black text-center'>
                                            {new Date(item.bulan).toLocaleDateString('id-ID', { month: 'long' })}
                                        </TableCell>
                                        {uniqueKomoditas.map((komoditas) => {
                                            const foundCommodity = item.list.find(k => k.komoditas.nama === komoditas);
                                            return (
                                                <TableCell className='border border-black p-2 text-black text-center' key={komoditas}>
                                                    {foundCommodity ? (
                                                        <div className="flex items-center m-auto justify-center gap-4">
                                                            <div className="nav flex pr-4 text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] justify-between transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
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
                        <TableCell className='border border-black p-2 text-black text-center font-semibold' colSpan={2}>Rata-rata</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='border border-black p-2 text-black text-center font-semibold' colSpan={2}>Maksimum</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='border border-black p-2 text-black text-center font-semibold' colSpan={2}>Minimum</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='border border-black p-2 text-black text-center font-semibold' colSpan={2}>Target CV</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='border border-black p-2 text-black text-center font-semibold' colSpan={2}>CV (%)</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                        <TableCell className="border border-black p-2 text-black text-center font-semibold">49000</TableCell>
                    </TableRow>
                </TableFooter> */}
                    </Table>
                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default KoefisienVariasiProdusenPrint