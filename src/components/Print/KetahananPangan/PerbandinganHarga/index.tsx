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


interface PrintProps {
    urlApi?: string;
    tahun?: string;
    kecamatan?: string;
}

const KepangPerbandingan = (props: PrintProps) => {

    // INTEGRASI
    // GET LIST
    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface ListItem {
        idList: number;
        idKomoditas: number;
        nama: string;
        rerata: number;
        sum: number;
        count: number;
    }

    interface KepangPerbandinganHarga {
        id: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        list: {
            id: number;
            kepangPedagangEceranId: number;
            kepangMasterKomoditasId: number;
            minggu1: number;
            minggu2: number;
            minggu3: number;
            minggu4: number;
            minggu5: number;
            createdAt: string;
            updatedAt: string;
            komoditas: Komoditas;
        }[];
    }

    interface DataItem {
        id: number;
        tanggal: string;
        bulan: number;
        tahun: number;
        list: ListItem[];
    }

    interface Response {
        status: number;
        message: string;
        data: {
            data: DataItem[];
            kepangPerbandinganHarga: KepangPerbandinganHarga[];
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
    //   
    // GET LIST
    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/perbandingan-harga/get?year=2024`,
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
    const printRef = useRef<HTMLDivElement>(null);  // Declare useRef at the top level

    const handlePrint = useReactToPrint({  // Declare useReactToPrint at the top level
        content: () => printRef.current,
    });

    // INTEGRASI
    if (error) return <div></div>;
    if (!dataKomoditas) return <div></div>;

    // Utility to format month name
    const getMonthName = (monthNumber: number): string => {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return months[monthNumber - 1];
    };

    // Create a map of month names to prices
    // Check if dataKomoditas and kepangPerbandinganHarga are defined
    const monthPricesMap = dataKomoditas?.data?.kepangPerbandinganHarga
        ? dataKomoditas?.data?.kepangPerbandinganHarga.reduce((acc, item) => {
            const month = getMonthName(new Date(item.tanggal).getMonth() + 1);
            item.list.forEach(komoditasItem => {
                if (!acc[komoditasItem.komoditas.nama]) {
                    acc[komoditasItem.komoditas.nama] = {};
                }
                acc[komoditasItem.komoditas.nama][month] = komoditasItem.minggu1; // Example for week 1, adjust as needed
            });
            return acc;
        }, {} as Record<string, Record<string, number>>)
        : {}; // Fallback to empty object if kepangPerbandinganHarga is undefined

    // Get unique commodity names
    const komoditasNames = Object.keys(monthPricesMap);
    //PRINT


    // download Excel
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/kepang-perbandingan-harga?year==${props.tahun}`;

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
            link.setAttribute('download', `Data Perbandingan Harga Komoditas Kabupaten Lampung Timur.xlsx`); // Nama file yang diunduh
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
                        <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                            Pilih Unduhan
                        </DropdownMenuLabel>
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                        {/* <DropdownMenuSeparator /> */}
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
                        Perbandingan Komoditas Harga Pangan Tingkat Pedagang Eceran <br />
                        Kabupaten Lampung Timur Tahun {props.tahun || currentYear}
                    </div>
                    {/* title */}
                    {/* table */}
                    <Table className='border border-black p-2 mt-1 text-xs'>
                        <TableHeader className='bg-white text-black'>
                            <TableRow>

                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Periode Waktu</TableHead>
                                {komoditasNames.map((komoditas, index) => (
                                    <TableHead key={index} className="border border-black p-2 text-black uppercase text-center font-semibold">{komoditas}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, index) => (
                                <TableRow key={index}>
                                    <TableCell className='border border-black p-2 text-black'>{month}</TableCell>
                                    {komoditasNames.map((komoditas, i) => (
                                        <TableCell className='border border-black p-2 text-black text-center' key={i}>
                                            {monthPricesMap[komoditas][month] || "-"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default KepangPerbandingan