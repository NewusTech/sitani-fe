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
    startDate?: string;
    endDate?: string;
    kecamatan?: string;
    tahun?: string;
}

const KetahananPanganProdusenEceranPrint = (props: PrintProps) => {

    // INTEGRASI
    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface ListItem {
        id: number;
        kepangProdusenEceranId: number;
        kepangMasterKomoditasId: number;
        satuan: string | null;
        harga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        komoditas: Komoditas;
    }

    interface DataItem {
        id: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        list: ListItem[];
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

    interface Response {
        status: number;
        message: string;
        data: {
            data: DataItem[];
            pagination: Pagination;
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
    const { data: dataUser }: SWRResponse<Response> = useSWR(
        // `/psp/pupuk/get`,
        `${props.urlApi}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET LIST

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
    const { data: dataProdusenEceran }: SWRResponse<Response> = useSWR(
        `/kepang/produsen-eceran/get?page=${currentPage}&search=${search}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    //PRINT
    // print
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    // download Excel
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/kepang-produsen-eceran?startDate=${props.startDate}&endDate=${props.endDate}`;

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
            link.setAttribute('download', `DAFTAR_HARGA_PRODUSEN_DAN_ECERAN.xlsx`); // Nama file yang diunduh
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
                pdf.save(`DAFTAR_HARGA_PRODUSEN_DAN_ECERAN.pdf`);

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

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Bulan di JavaScript dimulai dari 0
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    //PRINT 
    let num = 1;

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
                    <div className="text-xl mb-4 font-semibold text-black mx-auto uppercase flex justify-center">
                        Daftar Harga Produsen Dan Eceran Periode {formattedDate}
                    </div>
                    {/* title */}
                    {/* table */}
                    <Table className='border border-black p-2 mt-1 uppercase text-xs'>
                        <TableHeader className='bg-white text-black'>
                            <TableRow >
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">No</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Tanggal</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Komoditas</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Satuan</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Harga Komoditas</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Keterangan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataProdusenEceran?.data?.data && dataProdusenEceran?.data?.data.length > 0 ? (
                                dataProdusenEceran.data.data.map((item, index) => (
                                    item?.list?.map((citem, cindex) => (
                                        <TableRow key={citem.id}>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {num++}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {/* {item.tanggal} */}
                                                {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }) : 'Tanggal tidak tersedia'}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {citem?.komoditas.nama}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {citem?.satuan}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {citem?.harga?.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {citem?.keterangan}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
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

export default KetahananPanganProdusenEceranPrint