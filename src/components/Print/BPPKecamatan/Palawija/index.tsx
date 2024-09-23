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
    bulan?: string | number;
    kecamatan?: string;
}

const KecamatanKorluhPalawijaPrint = (props: PrintProps) => {

    // INTEGRASI
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface DetailItem {
        id: number;
        tphRealisasiPadiId: number;
        kecamatanId: number;
        panenLahanSawah: number;
        produktivitasLahanSawah: number;
        produksiLahanSawah: number;
        panenLahanKering: number;
        produktivitasLahanKering: number;
        produksiLahanKering: number;
        panenTotal: number;
        produktivitasTotal: number;
        produksiTotal: number;
        kecamatan: Kecamatan;
    }

    interface Detail {
        bulan: string;
        list: DetailItem[];
    }

    interface Data {
        detail: Detail;
        produktivitasLahanKering: number;
        produktivitasLahanSawah: number;
        produksiLahanKering: number;
        produksiLahanSawah: number;
        panenLahanKering: number;
        panenLahanSawah: number;
        produktivitasTotal: number;
        produksiTotal: number;
        panenTotal: number;
    }

    interface Response {
        status: number;
        message: string;
        data: Data;
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
    const { data: responseData }: SWRResponse<Response> = useSWR(
        // `/tph/realisasi-palawija-1/get?bulan=2024/1`,
        `${props.urlApi}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // INTEGRASI
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface ResponseFilter {
        status: string;
        data: Kecamatan;
        message: string;
    }

    // DATA FILTER PDF
    const { data: dataFilter, error } = useSWR<ResponseFilter>(
        `/kecamatan/get/${props.kecamatan}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        }
    );
    //PRINT
    // print
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    // download Excel
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/korluh-palawija?kecamatan=${props.kecamatan}&bulan=${props.tahun}/${props.bulan}`;
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
            link.setAttribute('download', `BPP Kecamatan Palawija Kabupaten Lampung Timur.xlsx`); // Nama file yang diunduh
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
                pdf.save(`Data Tanaman Pangan Holtikultura Padi Kabupaten Lampung Timur.pdf`);

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
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    // Check if props.bulan is a number and map it to month name
    const monthNumber = typeof props.bulan === 'number' ? props.bulan : Number(props.bulan);
    const monthName = monthNumber >= 1 && monthNumber <= 12 ? months[monthNumber - 1] : 'tidak ada';


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
                    {/* title */}
                    <div className="text-xl mb-4 font-semibold text-black mx-auto uppercase flex justify-center text-center">
                        LUAS PANEN, PRODUKTIVITAS DAN PRODUKSI LAHAN SAWAH, LAHAN KERING, TOTAL <br /> KABUPATEN LAMPUNG TIMUR TAHUN {props.tahun || currentYear} <br />
                        {monthName}
                    </div>
                    {/* title */}
                    {/* table */}

                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default KecamatanKorluhPalawijaPrint