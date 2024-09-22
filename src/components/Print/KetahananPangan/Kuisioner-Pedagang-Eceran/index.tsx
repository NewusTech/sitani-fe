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
}

const KuisionerPedagangEceranPrint = (props: PrintProps) => {

    // INTEGRASI
    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface ListItem {
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
    }

    interface DataItem {
        id: number;
        mg1: string;
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
    const { data: dataProdusenEceran }: SWRResponse<Response> = useSWR(
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
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/psp-pupuk?kecamatan=${props.kecamatan}&startDate=${props.startDate}&endDate=${props.endDate}`;

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
            link.setAttribute('download', `KUESIONER_DATA_HARIAN_PANEL_PEDAGANG_ECERAN.xlsx`); // Nama file yang diunduh
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
                pdf.save(`KUESIONER_DATA_HARIAN_PANEL_PEDAGANG_ECERAN.pdf`);

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
                    <div className="text-xl mb-4 font-semibold text-black mx-auto uppercase flex justify-center">
                        Kuisioner Data Harian Panel Pedagang Eceran
                    </div>
                    <div className="flex gap-20">
                        <div className="div">
                            <div className="div">Kab :</div>
                            <div className="div">Prov :</div>
                        </div>
                        <div className="div">Bulan :</div>
                    </div>
                    <div className="text-left">
                        1. Tingkat Pedagang Eceran (PANEL PDE)
                    </div>
                    {/* title */}
                    {/* table */}
                    <Table className='border border-black p-2 mt-1 text-xs'>
                        <TableHeader className='bg-white text-black'>
                            <TableRow >
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">No</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Komoditas</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">MG I</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">MG II</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">MG III</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">MG IV</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">MG V</TableHead>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">Rata2 Per Bulan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataProdusenEceran?.data?.data && dataProdusenEceran?.data?.data.length > 0 ? (
                                (() => {
                                    let globalIndex = 1; // Inisialisasi global index
                                    return dataProdusenEceran.data.data.map((item, index) => (
                                        item?.list?.map((citem, cindex) => (
                                            <TableRow key={citem.id}>
                                                <TableCell>
                                                    {globalIndex++} {/* Menggunakan globalIndex */}
                                                </TableCell>
                                                <TableCell>
                                                    {citem?.komoditas.nama}
                                                </TableCell>
                                                <TableCell>
                                                    {citem?.minggu1}
                                                </TableCell>
                                                <TableCell>
                                                    {citem?.minggu2}
                                                </TableCell>
                                                <TableCell>
                                                    {citem?.minggu3}
                                                </TableCell>
                                                <TableCell>
                                                    {citem?.minggu4}
                                                </TableCell>
                                                <TableCell>
                                                    {citem?.minggu5}
                                                </TableCell>
                                                <TableCell>
                                                    {(citem?.minggu1 + citem?.minggu2 + citem?.minggu3 + citem?.minggu4 + citem?.minggu5) / 5}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ));
                                })()
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">
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

export default KuisionerPedagangEceranPrint