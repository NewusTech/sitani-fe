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

const TPHPadi = (props: PrintProps) => {

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
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/tph-realisasi-palawija-1?kecamatan=${props.kecamatan}&year=${props.tahun}`;
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
            link.setAttribute('download', `Data Tanaman Pangan Holtikultura Palawija 1 Kabupaten Lampung Timur.xlsx`); // Nama file yang diunduh
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
                pdf.save(`Data Tanaman Pangan Holtikultura Palawija 1 Kabupaten Lampung Timur.pdf`);

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
                    <div className="text-xl mb-4 font-semibold text-black mx-auto uppercase flex justify-center text-center">
                        LUAS PANEN, PRODUKTIVITAS DAN PRODUKSI LAHAN SAWAH, LAHAN KERING, TOTAL <br /> KABUPATEN LAMPUNG TIMUR TAHUN {props.tahun || currentYear} <br />
                        {monthName}
                    </div>
                    {/* title */}
                    {/* table */}
                    <Table className='border border-black p-2 mt-1 text-xs'>
                        <TableHeader className='bg-gray-100 text-black'>
                            <TableRow>
                                <TableHead rowSpan={2} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    No
                                </TableHead>
                                <TableHead rowSpan={2} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    Kecamatan
                                </TableHead>
                                <TableHead colSpan={3} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    Lahan Sawah
                                </TableHead>
                                <TableHead colSpan={3} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    Lahan Kering
                                </TableHead>
                                <TableHead colSpan={3} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    Total
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Panen <br /> (ha)
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Produktivitas <br /> (ku/ha)
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Produksi <br /> (ton)
                                    </TableHead>
                                </>
                                <>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Panen <br /> (ha)
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Produktivitas <br /> (ku/ha)
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Produksi <br /> (ton)
                                    </TableHead>
                                </>
                                <>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Panen <br /> (ha)
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Produktivitas <br /> (ku/ha)
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Produksi <br /> (ton)
                                    </TableHead>
                                </>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responseData?.data && responseData?.data?.detail?.list?.length > 0 ? (
                                responseData?.data?.detail?.list.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                            {item.kecamatan.nama}
                                        </TableCell>
                                        <>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.panenLahanSawah}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.produktivitasLahanSawah}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.produksiLahanSawah}
                                            </TableCell>
                                        </>
                                        <>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.panenLahanKering}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.produktivitasLahanKering}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.produksiLahanKering}
                                            </TableCell>
                                        </>
                                        <>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.panenTotal}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.produktivitasTotal}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                                {item.produksiTotal}
                                            </TableCell>
                                        </>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={13} className="text-center">
                                        Tidak ada data
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell className='border border-black p-2 text-black text-center'>
                                </TableCell>
                                <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                    Jumlah
                                </TableCell>
                                <>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.panenLahanSawah}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.produktivitasLahanSawah}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.produksiLahanSawah}
                                    </TableCell>
                                </>
                                <>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.panenLahanKering}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.produktivitasLahanKering}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.produksiLahanKering}
                                    </TableCell>
                                </>
                                <>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.panenTotal}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.produktivitasTotal}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black uppercase text-center font-semibold'>
                                        {responseData?.data?.produksiTotal}
                                    </TableCell>
                                </>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default TPHPadi